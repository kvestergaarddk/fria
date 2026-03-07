/**
 * Engangs-script: henter 500 populære glutenfri+laktosefri opskrifter
 * fra Spoonacular og gemmer dem som public/recipes.json.
 *
 * Kør med: node scripts/fetch-recipes.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

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
const DEEPL_KEY = process.env.DEEPL_API_KEY

if (!SPOONACULAR_KEY) {
  console.error('Mangler SPOONACULAR_API_KEY i .env')
  process.exit(1)
}

const hasDeepL = DEEPL_KEY && !DEEPL_KEY.includes('din-')

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

const TOTAL = 150
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

// ─── Oversæt titler via DeepL ─────────────────────────────────────────────────
async function translateTitles(titles) {
  if (!hasDeepL) return titles
  try {
    const body = new URLSearchParams({ target_lang: 'DA', source_lang: 'EN' })
    titles.forEach(t => body.append('text', t))
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!res.ok) throw new Error(`DeepL fejl ${res.status}`)
    const data = await res.json()
    return data.translations.map(t => t.text)
  } catch (err) {
    console.warn('DeepL-oversættelse fejlede:', err.message)
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
  const batches = TOTAL / BATCH
  const allRecipes = []

  console.log(`Henter ${TOTAL} opskrifter fra Spoonacular...`)

  for (let i = 0; i < batches; i++) {
    const offset = i * BATCH
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

  // Deduplikér på id
  const seen = new Set()
  const unique = allRecipes.filter(r => {
    if (seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })
  console.log(`\nUnike opskrifter: ${unique.length}`)

  // Oversæt titler
  console.log(hasDeepL ? 'Oversætter titler via DeepL...' : 'Ingen DeepL-nøgle — beholder engelske titler')
  const titles = unique.map(r => r.title)
  const translated = await translateTitles(titles)

  // Byg slim-objekter
  const slim_recipes = unique.map((r, i) => slim(r, translated[i]))

  // Gem
  mkdirSync(join(ROOT, 'public'), { recursive: true })
  const outPath = join(ROOT, 'public', 'recipes.json')
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
