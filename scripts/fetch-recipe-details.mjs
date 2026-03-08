/**
 * Henter fuld detaljeret opskriftsdata fra Spoonacular for alle opskrifter i recipes.json,
 * oversætter ingredienser og fremgangsmåde til dansk med Claude Haiku,
 * og gemmer hvert resultat som public/recipes/[id].json.
 *
 * Scriptet er resume-venligt: springer over opskrifter der allerede har en fil.
 *
 * Kør med: node scripts/fetch-recipe-details.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Læs .env
try {
  const env = readFileSync(join(ROOT, '.env'), 'utf8')
  env.split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
} catch { console.warn('.env ikke fundet') }

const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

if (!SPOONACULAR_KEY) { console.error('Mangler SPOONACULAR_API_KEY'); process.exit(1) }
if (!ANTHROPIC_KEY) { console.error('Mangler ANTHROPIC_API_KEY'); process.exit(1) }

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ─── Enhedskonvertering (samme logik som src/utils/units.js) ──────────────────
function toC(f) { return Math.round((f - 32) * 5 / 9) }

const REPLACEMENTS = [
  [/(\d+)\s*°F/gi, (_, f) => `${toC(Number(f))}°C`],
  [/(\d+)\s*degrees?\s+fahrenheit/gi, (_, f) => `${toC(Number(f))}°C`],
  [/(\d+(?:[.,]\d+)?)\s*cups?/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 2.4)} dl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:tablespoons?|tbsp|tbs)/gi, (_, n) => `${Number(n.replace(',', '.')) === 1 ? '1' : Number(n.replace(',', '.'))} spsk`],
  [/(\d+(?:[.,]\d+)?)\s*(?:teaspoons?|tsp)/gi, (_, n) => `${Number(n.replace(',', '.'))} tsk`],
  [/(\d+(?:[.,]\d+)?)\s*(?:fluid\s+ounces?|fl\.?\s*oz)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 3)} cl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:pints?)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 4.7)} dl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:quarts?)/gi, (_, n) => `${(Number(n.replace(',', '.')) * 0.95).toFixed(1)} liter`],
  [/(\d+(?:[.,]\d+)?)\s*(?:gallons?)/gi, (_, n) => `${(Number(n.replace(',', '.')) * 3.8).toFixed(1)} liter`],
  [/(\d+(?:[.,]\d+)?)\s*(?:pounds?|lbs?)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 454)} g`],
  [/(\d+(?:[.,]\d+)?)\s*(?:ounces?|oz)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 28)} g`],
  [/(\d+(?:[.,]\d+)?)\s*inches?/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 2.5)} cm`],
  [/(\d+)\s*sticks?\s+(?:of\s+)?butter/gi, (_, n) => `${Number(n) * 115} g smør`],
  [/\bpinch\b/gi, 'knivspids'],
  [/\bdash\b/gi, 'skvæt'],
  [/\bhandful\b/gi, 'håndfuld'],
  [/\bbunch\b/gi, 'bundt'],
  [/\bslices?\b/gi, (m) => m.endsWith('s') ? 'skiver' : 'skive'],
  [/\bcans?\b/gi, (m) => m.endsWith('s') ? 'dåser' : 'dåse'],
]

function normalizeUnits(text) {
  if (!text) return text
  let result = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

// ─── Spoonacular bulk-hentning (op til 100 ad gangen) ────────────────────────
async function fetchBulk(ids) {
  const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join(',')}&includeNutrition=false&apiKey=${SPOONACULAR_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Spoonacular fejl ${res.status}: ${await res.text()}`)
  return res.json()
}

// ─── Claude Haiku oversættelse ────────────────────────────────────────────────
async function translateBatch(texts) {
  if (!texts.length) return []
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Oversæt følgende madopskrift-tekster fra engelsk til dansk. Konvertér måleenheder: cups→dl, tablespoon→spsk, teaspoon→tsk, °F→°C (med beregning), oz→g, lb→g, inch→cm, pinch→knivspids, dash→skvæt, handful→håndfuld, clove→fed, bunch→bundt. Returnér KUN et JSON-array i samme rækkefølge. Ingen forklaring.\n\n${JSON.stringify(texts)}`,
    }],
  })
  return JSON.parse(res.content[0].text.trim())
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const outDir = join(ROOT, 'public', 'recipes')
  mkdirSync(outDir, { recursive: true })

  const { recipes } = JSON.parse(readFileSync(join(ROOT, 'public', 'recipes.json'), 'utf8'))
  const allIds = recipes.map(r => r.id)

  // Find hvilke der mangler
  const missing = allIds.filter(id => !existsSync(join(outDir, `${id}.json`)))
  console.log(`${allIds.length} opskrifter i alt — ${missing.length} mangler`)
  if (!missing.length) { console.log('Alle filer findes allerede.'); return }

  // Hent fra Spoonacular i bulk à 100
  const BULK = 100
  let fetched = []
  for (let i = 0; i < missing.length; i += BULK) {
    const chunk = missing.slice(i, i + BULK)
    console.log(`  Spoonacular bulk ${Math.floor(i/BULK)+1}: ${chunk.length} opskrifter...`)
    const data = await fetchBulk(chunk)
    fetched.push(...data)
    if (i + BULK < missing.length) await new Promise(r => setTimeout(r, 500))
  }

  console.log(`Hentet ${fetched.length} opskrifter fra Spoonacular`)

  // Oversæt og gem i batches af 20 opskrifter ad gangen
  const TRANS_BATCH = 20
  let saved = 0

  for (let i = 0; i < fetched.length; i += TRANS_BATCH) {
    const chunk = fetched.slice(i, i + TRANS_BATCH)
    const listEntry = recipes.reduce((m, r) => { m[r.id] = r; return m }, {})

    // Byg tekst-liste: [titel, ...ingredienser, ...trin] for alle i chunk
    const allTexts = []
    const meta = [] // {titleIdx, ingStart, ingLen, stepsStart, stepsLen}

    for (const r of chunk) {
      const title = r.title || ''
      const ingredients = (r.extendedIngredients || []).map(i => i.original || '')
      const steps = []
      ;(r.analyzedInstructions || []).forEach(b => b.steps.forEach(s => steps.push(s.step || '')))

      meta.push({
        id: r.id,
        titleIdx: allTexts.length,
        ingStart: allTexts.length + 1,
        ingLen: ingredients.length,
        stepsStart: allTexts.length + 1 + ingredients.length,
        stepsLen: steps.length,
        r,
        titleEn: title,
      })
      allTexts.push(title, ...ingredients, ...steps)
    }

    console.log(`  Oversætter batch ${Math.floor(i/TRANS_BATCH)+1} (${chunk.length} opskrifter, ${allTexts.length} tekster)...`)
    let translated
    try {
      translated = await translateBatch(allTexts)
    } catch (err) {
      console.warn(`  Oversættelsesfejl, beholder engelsk: ${err.message}`)
      translated = allTexts
    }

    for (const m of meta) {
      const title = translated[m.titleIdx] || m.titleEn
      const ingredients = Array.from({ length: m.ingLen }, (_, j) =>
        normalizeUnits(translated[m.ingStart + j] || (m.r.extendedIngredients[j]?.original || ''))
      )
      const steps = Array.from({ length: m.stepsLen }, (_, j) =>
        normalizeUnits(translated[m.stepsStart + j] || '')
      )

      const slim = {
        id: m.r.id,
        title,
        titleEn: m.titleEn,
        image: m.r.image || null,
        readyInMinutes: m.r.readyInMinutes || null,
        servings: m.r.servings || null,
        ingredients,
        steps,
      }

      writeFileSync(join(outDir, `${m.r.id}.json`), JSON.stringify(slim))
      saved++
    }

    console.log(`    → ${saved}/${missing.length} gemt`)
    if (i + TRANS_BATCH < fetched.length) await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nFærdig! ${saved} opskriftsfiler gemt i public/recipes/`)
}

main().catch(err => { console.error(err); process.exit(1) })
