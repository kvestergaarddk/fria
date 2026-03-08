/**
 * Genoversætter KUN fremgangsmåde-trinene for alle opskrifter i public/recipes/
 * med konsekvent imperativ/bydeform: "Hak løget", "Tilsæt fløden", osv.
 *
 * Kør med: node scripts/retranslate-steps.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

try {
  const env = readFileSync(join(ROOT, '.env'), 'utf8')
  env.split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
} catch { console.warn('.env ikke fundet') }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function translateSteps(steps) {
  if (!steps.length) return steps
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8096,
    messages: [{
      role: 'user',
      content: `Oversæt følgende madopskrift-trin fra engelsk til dansk. Brug ALTID imperativ (bydeform): "Hak løget", "Tilsæt fløden", "Bag i 20 minutter". Aldrig jeg-form eller "du skal"-form. Konvertér måleenheder: cups→dl, tablespoon→spsk, teaspoon→tsk, °F→°C (med beregning), oz→g, lb→g, inch→cm, pinch→knivspids, dash→skvæt. Returnér KUN et JSON-array i samme rækkefølge. Ingen forklaring.\n\n${JSON.stringify(steps)}`,
    }],
  })
  const raw = res.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(raw)
}

const dir = join(ROOT, 'public', 'recipes')
const files = readdirSync(dir).filter(f => f.endsWith('.json'))
console.log(`${files.length} opskrifter fundet`)

const BATCH = 5  // opskrifter per API-kald
let saved = 0

for (let i = 0; i < files.length; i += BATCH) {
  const chunk = files.slice(i, i + BATCH)

  // Saml alle trin fra chunk
  const allSteps = []
  const meta = []

  for (const file of chunk) {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    meta.push({ file, data, stepsStart: allSteps.length, stepsLen: data.steps.length })
    allSteps.push(...data.steps)
  }

  if (!allSteps.length) {
    saved += chunk.length
    continue
  }

  console.log(`  Batch ${Math.floor(i/BATCH)+1}: ${chunk.length} opskrifter, ${allSteps.length} trin...`)

  let translated
  try {
    translated = await translateSteps(allSteps)
  } catch (err) {
    console.warn(`  Fejl, beholder eksisterende: ${err.message}`)
    translated = allSteps
  }

  for (const m of meta) {
    m.data.steps = translated.slice(m.stepsStart, m.stepsStart + m.stepsLen)
    writeFileSync(join(dir, m.file), JSON.stringify(m.data))
    saved++
  }

  console.log(`    → ${saved}/${files.length} gemt`)
  if (i + BATCH < files.length) await new Promise(r => setTimeout(r, 200))
}

console.log(`\nFærdig! ${saved} opskrifter opdateret.`)
