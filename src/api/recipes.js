export async function fetchRecipes({ intolerances, type, number = 12, offset = 0 }) {
  const params = new URLSearchParams({ number: String(number), offset: String(offset) })
  if (intolerances) params.set('intolerances', intolerances)
  if (type) params.set('type', type)

  const response = await fetch(`/api/recipes?${params}`)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Serverfejl: ${response.status}`)
  }
  return response.json()
}

export async function fetchRecipeById(id) {
  const response = await fetch(`/api/recipes?id=${id}`)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Serverfejl: ${response.status}`)
  }
  return response.json()
}
