// Lokal dev-server der kører Vercel API-funktionerne som en Express-lignende HTTP-server
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = 3001

// Læs env-variabler fra .env
try {
  const env = readFileSync(join(__dirname, '.env'), 'utf8')
  env.split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
} catch {
  console.warn('.env fil ikke fundet')
}

async function loadHandler(name) {
  const path = pathToFileURL(join(__dirname, 'api', `${name}.js`)).href
  const mod = await import(path)
  return mod.default
}

function parseBody(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve({})
      }
    })
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.writeHead(200).end()

  const route = url.pathname.replace(/^\/api\//, '')

  try {
    const handler = await loadHandler(route)

    // Simuler Vercel req/res
    const query = Object.fromEntries(url.searchParams)
    const body = req.method === 'POST' ? await parseBody(req) : {}

    const mockReq = { method: req.method, query, body, headers: req.headers }
    const mockRes = {
      _status: 200,
      _headers: {},
      status(code) { this._status = code; return this },
      setHeader(k, v) { this._headers[k] = v; return this },
      end() { res.writeHead(this._status, this._headers); res.end() },
      json(data) {
        this._headers['Content-Type'] = 'application/json'
        res.writeHead(this._status, this._headers)
        res.end(JSON.stringify(data))
      },
    }

    await handler(mockReq, mockRes)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
})

server.listen(PORT, () => {
  console.log(`API-server kører på http://localhost:${PORT}`)
})
