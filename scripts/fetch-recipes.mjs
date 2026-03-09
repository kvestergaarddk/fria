/**
 * Henter populære glutenfri+laktosefri opskrifter fra Nordic, French og Italian køkken.
 * Oversætter titler med Claude og gemmer som public/recipes.json.
 * Inkluderer grundlæggende næringsindhold per opskrift.
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

// ─── Køkkener der hentes ──────────────────────────────────────────────────────
const CUISINES = ['Nordic', 'French', 'Italian']
const MAX_PER_CUISINE = 100  // Spoonacular max per request

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

// ─── Hent en specifik næringsværdi fra nutrition-objektet ────────────────────
function getNutrient(nutrition, name) {
  if (!nutrition?.nutrients) return null
  const n = nutrition.nutrients.find(n => n.name === name)
  return n ? Math.round(n.amount) : null
}

// ─── Hent opskrifter fra Spoonacular for ét køkken ───────────────────────────
async function fetchCuisine(cuisine) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    intolerances: 'gluten,dairy',
    cuisine: cuisine,
    sort: 'popularity',
    sortDirection: 'desc',
    addRecipeInformation: 'true',
    addRecipeNutrition: 'true',
    fillIngredients: 'true',
    instructionsRequired: 'true',
    number: String(MAX_PER_CUISINE),
    offset: '0',
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
    const raw = response.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Claude-oversættelse fejlede:', err.message)
    return titles
  }
}

// ─── Slim recipe til kun det vi har brug for ──────────────────────────────────
function slim(recipe, translatedTitle) {
  const nutrition = recipe.nutrition || null
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
    nutrition: nutrition ? {
      calories: getNutrient(nutrition, 'Calories'),
      protein: getNutrient(nutrition, 'Protein'),
      fat: getNutrient(nutrition, 'Fat'),
      carbs: getNutrient(nutrition, 'Carbohydrates'),
      fiber: getNutrient(nutrition, 'Fiber'),
    } : null,
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const outPath = join(ROOT, 'public', 'recipes.json')

  // Bevar håndskrevne opskrifter (id >= 10000)
  let handwritten = []
  try {
    const raw = JSON.parse(readFileSync(outPath, 'utf8'))
    // Håndskrevne opskrifter har id 10000-99999. Spoonacular-id'er er 6+ cifre (≥ 100000).
    handwritten = (raw.recipes || []).filter(r => r.id >= 10000 && r.id < 100000)
    console.log(`Bevarer ${handwritten.length} håndskrevne opskrifter (id 10000-99999)`)
  } catch {
    console.log('Ingen eksisterende recipes.json — starter forfra')
  }

  const allFetched = []

  for (const cuisine of CUISINES) {
    console.log(`\nHenter ${cuisine}-opskrifter...`)
    try {
      const data = await fetchCuisine(cuisine)
      const results = data.results || []
      console.log(`  → ${results.length} opskrifter (${data.totalResults} tilgængelige i alt)`)
      allFetched.push(...results)
    } catch (err) {
      console.error(`  Fejl for ${cuisine}:`, err.message)
    }
    // Kort pause for at undgå rate-limit
    if (cuisine !== CUISINES[CUISINES.length - 1]) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  // Deduplikér (samme opskrift kan dukke op i flere køkkener)
  const seen = new Set()
  const unique = allFetched.filter(r => {
    if (seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })
  console.log(`\nUnikke opskrifter fra API: ${unique.length}`)

  // Oversæt titler
  console.log(hasAnthropic ? 'Oversætter titler via Claude...' : 'Ingen ANTHROPIC_API_KEY — beholder engelske titler')
  const titles = unique.map(r => r.title)
  const translated = await translateTitles(titles)

  // Byg slim-objekter
  const apiRecipes = unique.map((r, i) => slim(r, translated[i]))

  // Merge: håndskrevne opskrifter + API-opskrifter
  const merged = [...handwritten, ...apiRecipes]
  console.log(`Total: ${merged.length} opskrifter (${handwritten.length} håndskrevne + ${apiRecipes.length} fra API)`)

  // Gem
  mkdirSync(join(ROOT, 'public'), { recursive: true })
  writeFileSync(outPath, JSON.stringify({ recipes: merged, fetchedAt: new Date().toISOString() }, null, 2))
  const kb = Math.round(readFileSync(outPath).length / 1024)
  console.log(`\nGemt: public/recipes.json (${kb} KB)`)

  // Stats
  const cuisineCount = {}
  const proteins = {}
  const withNutrition = apiRecipes.filter(r => r.nutrition?.calories).length
  apiRecipes.forEach(r => {
    const c = r.cuisines[0] || 'ukendt'
    cuisineCount[c] = (cuisineCount[c] || 0) + 1
    proteins[r.protein] = (proteins[r.protein] || 0) + 1
  })
  console.log('\nKøkken-fordeling (API):', cuisineCount)
  console.log('Protein-fordeling (API):', proteins)
  console.log(`Næringsdata tilgængeligt: ${withNutrition}/${apiRecipes.length} opskrifter`)
}

main().catch(err => { console.error(err); process.exit(1) })
