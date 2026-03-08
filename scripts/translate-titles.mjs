import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

try {
  const env = readFileSync(join(ROOT, '.env'), 'utf8')
  env.split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
} catch { }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const dataPath = join(ROOT, 'public', 'recipes.json')
const data = JSON.parse(readFileSync(dataPath, 'utf8'))
const recipes = data.recipes

const BATCH = 75

async function translateBatch(titles) {
  const res = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: `Oversæt følgende madopskrift-titler fra engelsk til dansk. Returnér KUN et JSON-array i samme rækkefølge. Ingen forklaring.\n\n${JSON.stringify(titles)}` }],
  })
  return JSON.parse(res.content[0].text.trim())
}

console.log(`Oversætter ${recipes.length} titler...`)
for (let i = 0; i < recipes.length; i += BATCH) {
  const chunk = recipes.slice(i, i + BATCH)
  const titles = chunk.map(r => r.titleEn || r.title)
  console.log(`  Batch ${Math.floor(i / BATCH) + 1}: offset ${i}...`)
  const translated = await translateBatch(titles)
  translated.forEach((t, j) => { recipes[i + j].title = t })
  if (i + BATCH < recipes.length) await new Promise(r => setTimeout(r, 300))
}

writeFileSync(dataPath, JSON.stringify(data, null, 2))
console.log('Færdig — alle titler oversat.')
