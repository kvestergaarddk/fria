/**
 * Engangs-script: henter 500 populære glutenfri+laktosefri opskrifter
 * fra Spoonacular og gemmer dem som public/recipes.json.
 *
 * Kør med: node scripts/fetch-recipes.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
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
} catch {
  console.warn('.env ikke fundet')
}

const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

if (!SPOONACULAR_KEY) {
  console.error('Mangler SPOONACULAR_API_KEY i .env')
  process.exit(1)
}

const hasAnthropic = ANTHROPIC_KEY && !ANTHROPIC_KEY.includes('din-')
const anthropic = hasAnthropic ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null

// ─── Protein-detektion ────────────────────────────────────────────────────────
const CHICKEN_WORDS = ['chicken', 'turkey', 'poultry', 'hen', 'duck']
const BEEF_WORDS = ['beef', 'steak', 'ground beef', 'pork', 'lamb', 'veal', 'bacon', 'sausage', 'ham', 'prosciutto', 'pancetta']
const FISH_WORDS = ['salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'shrimp', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop', 'anchovy', 'sardine', 'fish', 'seafood', 'squid', 'octopus']

function detectProtein(recipe) {
  const veg = recipe.diets || []
  if (veg.includes('vegan') || veg.includes('vegetarian')) return 'vegetarian'

  const names = (recipe.extendedIngredients || []).map(i => i.name?.toLowerCase() || '')
  const title = (recipe.title || '').toLowerCase()
  const all = [...names, title].join(' ')

  if (FISH_WORDS.some(w => all.includes(w))) return 'fish'
  if (CHICKEN_WORDS.some(w => all.includes(w))) return 'chicken'
  if (BEEF_WORDS.some(w => all.includes(w))) return 'meat'
  return 'other'
}

const FETCH_MORE = 150  // Antal nye opskrifter at hente denne kørsel
const BATCH = 75

// ─── Hent opskrifter fra Spoonacular ─────────────────────────────────────────
async function fetchBatch(offset) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    intolerances: 'gluten,dairy',
    sort: 'popularity',
    sortDirection: 'desc',
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    number: String(BATCH),
    offset: String(offset),
  })
  const url = `https://api.spoonacular.com/recipes/complexSearch?${params}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Spoonacular fejl ${res.status}: ${await res.text()}`)
  return res.json()
}

// ─── Oversæt titler via Claude ────────────────────────────────────────────────
async function translateTitles(titles) {
  if (!hasAnthropic) return titles
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Oversæt følgende madopskrift-titler fra engelsk til dansk. Returnér KUN et JSON-array med de oversatte titler i samme rækkefølge. Ingen forklaring, kun arrayet.\n\n${JSON.stringify(titles)}`,
      }],
    })
    return JSON.parse(response.content[0].text.trim())
  } catch (err) {
    console.warn('Claude-oversættelse fejlede:', err.message)
    return titles
  }
}

// ─── Slim recipe til kun det vi har brug for ──────────────────────────────────
function slim(recipe, translatedTitle) {
  return {
    id: recipe.id,
    title: translatedTitle || recipe.title,
    titleEn: recipe.title,
    image: recipe.image || null,
    readyInMinutes: recipe.readyInMinutes || null,
    dishTypes: recipe.dishTypes || [],
    cuisines: (recipe.cuisines || []).map(c => c.toLowerCase()),
    diets: recipe.diets || [],
    protein: detectProtein(recipe),
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // Indlæs eksisterende opskrifter
  const outPath = join(ROOT, 'public', 'recipes.json')
  let existing = []
  try {
    const raw = JSON.parse(readFileSync(outPath, 'utf8'))
    existing = raw.recipes || []
    console.log(`Indlæst ${existing.length} eksisterende opskrifter`)
  } catch {
    console.log('Ingen eksisterende recipes.json — starter forfra')
  }

  const startOffset = existing.length
  const batches = Math.ceil(FETCH_MORE / BATCH)
  const allRecipes = []

  console.log(`Henter ${FETCH_MORE} nye opskrifter fra offset ${startOffset}...`)

  for (let i = 0; i < batches; i++) {
    const offset = startOffset + i * BATCH
    console.log(`  Batch ${i + 1}/${batches} (offset ${offset})...`)
    try {
      const data = await fetchBatch(offset)
      allRecipes.push(...(data.results || []))
      console.log(`    → ${data.results?.length || 0} opskrifter (total: ${allRecipes.length})`)
    } catch (err) {
      console.error(`  Fejl i batch ${i + 1}:`, err.message)
    }
    // Kort pause for at undgå rate-limit
    if (i < batches - 1) await new Promise(r => setTimeout(r, 500))
  }

  // Deduplikér nye mod eksisterende
  const existingIds = new Set(existing.map(r => r.id))
  const seen = new Set()
  const unique = allRecipes.filter(r => {
    if (existingIds.has(r.id) || seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })
  console.log(`\nNye unikke opskrifter: ${unique.length}`)

  // Oversæt titler
  console.log(hasAnthropic ? 'Oversætter titler via Claude...' : 'Ingen ANTHROPIC_API_KEY — beholder engelske titler')
  const titles = unique.map(r => r.title)
  const translated = await translateTitles(titles)

  // Byg slim-objekter og merge med eksisterende
  const newSlim = unique.map((r, i) => slim(r, translated[i]))
  const slim_recipes = [...existing, ...newSlim]
  console.log(`Total efter merge: ${slim_recipes.length} opskrifter`)

  // Gem
  mkdirSync(join(ROOT, 'public'), { recursive: true })
  writeFileSync(outPath, JSON.stringify({ recipes: slim_recipes, fetchedAt: new Date().toISOString() }, null, 2))
  const kb = Math.round(readFileSync(outPath).length / 1024)
  console.log(`\nGemt: public/recipes.json (${kb} KB, ${slim_recipes.length} opskrifter)`)

  // Stats
  const proteins = {}
  const cuisines = {}
  slim_recipes.forEach(r => {
    proteins[r.protein] = (proteins[r.protein] || 0) + 1
    r.cuisines.forEach(c => { cuisines[c] = (cuisines[c] || 0) + 1 })
  })
  console.log('\nProtein-fordeling:', proteins)
  console.log('Top-køkkener:', Object.entries(cuisines).sort((a,b) => b[1]-a[1]).slice(0, 10))
}

main().catch(err => { console.error(err); process.exit(1) })
