/**
 * Konverterer resterende engelske måleenheder til dansk.
 * Bruges som efterbehandling efter AI-oversættelse som sikkerhedsnet.
 */

function toC(f) {
  return Math.round((f - 32) * 5 / 9)
}

// Regex-baserede konverteringer (case-insensitive)
const REPLACEMENTS = [
  // Temperatur — skal køre FØR andre regler
  [/(\d+)\s*°F/gi, (_, f) => `${toC(Number(f))}°C`],
  [/(\d+)\s*degrees?\s+fahrenheit/gi, (_, f) => `${toC(Number(f))}°C`],

  // Volumen med tal — konvertér numerisk
  [/(\d+(?:[.,]\d+)?)\s*cups?/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 2.4)} dl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:tablespoons?|tbsp|tbs)/gi, (_, n) => {
    const val = Number(n.replace(',', '.'))
    return val === 1 ? '1 spsk' : `${val} spsk`
  }],
  [/(\d+(?:[.,]\d+)?)\s*(?:teaspoons?|tsp)/gi, (_, n) => {
    const val = Number(n.replace(',', '.'))
    return val === 1 ? '1 tsk' : `${val} tsk`
  }],
  [/(\d+(?:[.,]\d+)?)\s*(?:fluid\s+ounces?|fl\.?\s*oz)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 3)} cl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:pints?)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 4.7)} dl`],
  [/(\d+(?:[.,]\d+)?)\s*(?:quarts?)/gi, (_, n) => `${(Number(n.replace(',', '.')) * 0.95).toFixed(1)} liter`],
  [/(\d+(?:[.,]\d+)?)\s*(?:gallons?)/gi, (_, n) => `${(Number(n.replace(',', '.')) * 3.8).toFixed(1)} liter`],

  // Vægt med tal — konvertér numerisk
  [/(\d+(?:[.,]\d+)?)\s*(?:pounds?|lbs?)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 454)} g`],
  [/(\d+(?:[.,]\d+)?)\s*(?:ounces?|oz)/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 28)} g`],

  // Længde
  [/(\d+(?:[.,]\d+)?)\s*inches?/gi, (_, n) => `${Math.round(Number(n.replace(',', '.')) * 2.5)} cm`],

  // Stik/smør
  [/(\d+)\s*sticks?\s+(?:of\s+)?butter/gi, (_, n) => `${Number(n) * 115} g smør`],

  // Vage enheder (uden talkonvertering)
  [/\bpinch\b/gi, 'knivspids'],
  [/\bdash\b/gi, 'skvæt'],
  [/\bhandful\b/gi, 'håndfuld'],
  [/\bcloves?\b/gi, (m) => m.endsWith('s') ? 'fed' : 'fed'],
  [/\bbunch\b/gi, 'bundt'],
  [/\bslices?\b/gi, (m) => m.endsWith('s') ? 'skiver' : 'skive'],
  [/\bcans?\b/gi, (m) => m.endsWith('s') ? 'dåser' : 'dåse'],
]

export function normalizeUnits(text) {
  if (!text) return text
  let result = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}
