import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const INTOLERANCE_LABELS = {
  gluten: 'glutenfri',
  laktose: 'laktosefri',
  begge: 'glutenfri og laktosefri',
}

const SYSTEM_PROMPT = `Du er en ekspert i madlavning og kostintoleranser. Din opgave er at konvertere opskrifter til glutenfri og/eller laktosefri versioner.

Regler for ingredienserstatninger:
GLUTEN: Erstat hvedemel med glutenfrit mel (fx Schär Universal Mix eller Finax Glutenfri Melblanding), almindelig pasta med glutenfri pasta, soja sauce med tamari, almindeligt brød med glutenfrit brød. Angiv altid et mærke eller type i parentes.
LAKTOSE: Erstat mælk med plantemælk (havresmak, mandelmælk eller sojamælk — vælg hvad der passer bedst til opskriften), smør med plantemargarine (fx Naturli'), fløde med kokosfløde eller sojafløde, ost med laktosefri ost.
BEGGE: Anvend erstatninger for begge kategorier.

Tilpas fremgangsmåden hvis nødvendigt (fx hævetider for glutenfri dej, temperatur for alternative meltyper).

Returnér KUN et gyldigt JSON-objekt — ingen markdown, ingen forklaring, kun JSON:`

const JSON_SCHEMA = `
{
  "title": "Opskriftens titel på dansk",
  "servings": 4,
  "readyInMinutes": 45,
  "ingredients": ["Færdig liste med erstatninger indsat, fx '500g glutenfrit mel (Schär Universal Mix)'"],
  "substitutions": [
    { "original": "hvedemel", "replacement": "glutenfrit mel (Schär Universal Mix)", "ratio": "1:1", "note": "Tilsæt evt. lidt ekstra væske" }
  ],
  "steps": ["Trin 1: ...", "Trin 2: ..."],
  "conversionNotes": "Generelle noter om konverteringen — fx særlige ting at være opmærksom på"
}`

async function fetchAndCleanUrl(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Mavro-bot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const html = await response.text()
  // Strip script/style tags og HTML-tags
  const clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{3,}/g, '\n')
    .slice(0, 12000) // Max ~3000 tokens
  return clean
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY er ikke konfigureret' })
  }

  const { inputType, content, intolerance } = req.body

  if (!inputType || !content || !intolerance) {
    return res.status(400).json({ error: 'inputType, content og intolerance er påkrævet' })
  }
  if (!['url', 'text', 'image'].includes(inputType)) {
    return res.status(400).json({ error: 'inputType skal være url, text eller image' })
  }
  if (!['gluten', 'laktose', 'begge'].includes(intolerance)) {
    return res.status(400).json({ error: 'intolerance skal være gluten, laktose eller begge' })
  }

  const label = INTOLERANCE_LABELS[intolerance]

  try {
    let messages

    if (inputType === 'image') {
      // base64-format: "data:image/jpeg;base64,/9j/..."
      const match = content.match(/^data:(image\/[a-z]+);base64,(.+)$/)
      if (!match) return res.status(400).json({ error: 'Ugyldigt billedformat — forvent base64 data-URL' })
      const [, mediaType, imageData] = match

      messages = [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageData },
          },
          {
            type: 'text',
            text: `Læs opskriften fra dette billede og konverter den til en ${label} version.\n\nReturnér et JSON-objekt med præcis denne struktur:${JSON_SCHEMA}`,
          },
        ],
      }]
    } else {
      let recipeText = content

      if (inputType === 'url') {
        try {
          recipeText = await fetchAndCleanUrl(content)
        } catch (err) {
          return res.status(400).json({ error: `Kunne ikke hente URL: ${err.message}` })
        }
      }

      messages = [{
        role: 'user',
        content: `Konverter følgende opskrift til en ${label} version.\n\nOpskrift:\n${recipeText}\n\nReturnér et JSON-objekt med præcis denne struktur:${JSON_SCHEMA}`,
      }]
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    })

    const raw = response.content[0].text.trim()

    // Fjern evt. markdown code fences
    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const result = JSON.parse(jsonStr)

    return res.json({ result })
  } catch (error) {
    console.error('Konverteringsfejl:', error.message)
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Claude returnerede ugyldig JSON — prøv igen' })
    }
    return res.status(500).json({ error: error.message })
  }
}
