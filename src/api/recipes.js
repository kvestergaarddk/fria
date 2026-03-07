// Liste-opskrifter hentes fra statisk JSON (pre-fetchet én gang)
// Detail-opskrifter hentes stadig fra Spoonacular API (én gang pr. opskrift, cached)

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 dage

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}

function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

let _recipesCache = null

export async function loadAllRecipes() {
  if (_recipesCache) return _recipesCache
  const res = await fetch('/recipes.json')
  if (!res.ok) throw new Error('Kunne ikke hente opskrifter')
  const data = await res.json()
  _recipesCache = data.recipes || []
  return _recipesCache
}

export async function fetchRecipeById(id) {
  const cacheKey = `mavro_recipe_${id}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/recipes?id=${id}`)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Serverfejl: ${response.status}`)
  }
  const data = await response.json()
  cacheSet(cacheKey, data)
  return data
}
