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

export async function fetchRecipes({ intolerances, type, number = 12, offset = 0 }) {
  const params = new URLSearchParams({
    number: String(number),
    offset: String(offset),
    sort: 'popularity',
    sortDirection: 'desc',
  })
  if (intolerances) params.set('intolerances', intolerances)
  if (type) params.set('type', type)

  const cacheKey = `mavro_recipes_${params.toString()}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/recipes?${params}`)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Serverfejl: ${response.status}`)
  }
  const data = await response.json()
  cacheSet(cacheKey, data)
  return data
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
