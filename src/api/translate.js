// Enkel hash-funktion til cache-nøgler
function hashText(text) {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Konverter til 32-bit int
  }
  return Math.abs(hash).toString(36)
}

function getCached(text) {
  try {
    return localStorage.getItem(`deepl_${hashText(text)}`)
  } catch {
    return null
  }
}

function setCache(text, translation) {
  try {
    localStorage.setItem(`deepl_${hashText(text)}`, translation)
  } catch {
    // localStorage fuld — ignorer
  }
}

/**
 * Oversætter et array af engelske tekster til dansk.
 * Returnerer et array af oversatte tekster i samme rækkefølge.
 * Cacher i localStorage — tekster der allerede er oversat, sendes ikke til API.
 * Falder tilbage til originalteksten ved fejl.
 */
export async function translateTexts(texts) {
  if (!texts || texts.length === 0) return []

  const results = new Array(texts.length)
  const toTranslate = []
  const indices = []

  // Tjek cache
  texts.forEach((text, i) => {
    const cached = getCached(text)
    if (cached !== null) {
      results[i] = cached
    } else {
      toTranslate.push(text)
      indices.push(i)
    }
  })

  if (toTranslate.length === 0) return results

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: toTranslate }),
    })

    if (!response.ok) {
      // Returner originaler ved fejl
      indices.forEach((idx, j) => {
        results[idx] = toTranslate[j]
      })
      return results
    }

    const data = await response.json()
    const translated = data.translations || []

    translated.forEach((t, j) => {
      const original = toTranslate[j]
      const translatedText = t.text || original
      setCache(original, translatedText)
      results[indices[j]] = translatedText
    })

    // Hvis API returnerede færre end forventet
    indices.forEach((idx, j) => {
      if (results[idx] === undefined) results[idx] = toTranslate[j]
    })
  } catch {
    // Netværksfejl — brug originaltekster
    indices.forEach((idx, j) => {
      results[idx] = toTranslate[j]
    })
  }

  return results
}
