import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY er ikke konfigureret' })
  }

  const { texts } = req.body
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'texts skal være et ikke-tomt array' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Oversæt følgende madopskrift-tekster fra engelsk til dansk.

Vigtigt for måleenheder:
- cups/cup → dl (1 cup = 2,4 dl, rund af til nærmeste hele tal)
- tablespoon/tablespoons/tbsp/tbs → spsk
- teaspoon/teaspoons/tsp → tsk
- ounce/ounces/oz → g (1 oz = 28 g)
- pound/pounds/lb/lbs → g (1 lb = 454 g)
- fluid ounce/fl oz → cl (1 fl oz = 3 cl)
- inch/inches → cm (1 inch = 2,5 cm)
- °F → °C (formel: (F-32)×5/9, rund af til nærmeste hele tal)
- pinch → knivspids
- dash → skvæt
- handful → håndfuld
- clove/cloves (hvidløg) → fed
- bunch → bundt
- stick (smør) → 115 g
- can/cans → dåse/dåser

Returnér KUN et JSON-array med de oversatte strenge i samme rækkefølge. Ingen forklaring, ingen markdown, kun arrayet.

Tekster:
${JSON.stringify(texts)}`,
      }],
    })

    const raw = response.content[0].text.trim()
    const translations = JSON.parse(raw)

    return res.json({
      translations: translations.map(text => ({ text })),
    })
  } catch (error) {
    console.error('Oversættelsesfejl:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
