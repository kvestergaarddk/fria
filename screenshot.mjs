import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, 'temporary screenshots')
if (!existsSync(dir)) mkdirSync(dir)

const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''

const existing = readdirSync(dir).filter(f => f.endsWith('.png'))
const n = existing.length + 1
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`
const filepath = join(dir, filename)

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
await page.screenshot({ path: filepath, fullPage: false })
await browser.close()

console.log(`Screenshot gemt: temporary screenshots/${filename}`)
