export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'DEEPL_API_KEY er ikke konfigureret' })
  }

  const { texts } = req.body
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'texts skal være et ikke-tomt array' })
  }

  try {
    const params = new URLSearchParams({ target_lang: 'DA', source_lang: 'EN' })
    texts.forEach((t) => params.append('text', t))

    // Forsøg med DeepL Free endpoint — byt til https://api.deepl.com ved Pro-abonnement
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) throw new Error(`DeepL fejl: ${response.status}`)
    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
