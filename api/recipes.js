export default async function handler(req, res) {
  const origin = req.headers.origin
  if (origin === 'https://mavro.dk' || origin === 'https://www.mavro.dk') {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const apiKey = process.env.SPOONACULAR_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'SPOONACULAR_API_KEY er ikke konfigureret' })
  }

  const { id, intolerances, type, number = '12', offset = '0', sort = 'popularity', sortDirection = 'desc' } = req.query

  try {
    if (id) {
      // Enkelt opskrift med næring
      const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Spoonacular fejl: ${response.status}`)
      const data = await response.json()
      return res.json(data)
    } else {
      // Søg opskrifter
      const params = new URLSearchParams({
        apiKey,
        number,
        offset,
        addRecipeInformation: 'true',
        fillIngredients: 'false',
        instructionsRequired: 'true',
      })
      if (intolerances) params.set('intolerances', intolerances)
      if (type) params.set('type', type)
      if (sort) params.set('sort', sort)
      if (sortDirection) params.set('sortDirection', sortDirection)

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Spoonacular fejl: ${response.status}`)
      const data = await response.json()
      return res.json(data)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
