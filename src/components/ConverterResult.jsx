import { useState } from 'react'

const GREEN = '#315E4A'
const DARK_GREEN = '#1B3A28'
const CREAM = '#EEDDB6'
const GOLD = '#EFBA5A'

const INTOLERANCE_LABEL = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Glutenfri & laktosefri',
}

function downloadTxt(result, intolerance) {
  const lines = [
    result.title,
    '='.repeat(result.title.length),
    '',
    `${INTOLERANCE_LABEL[intolerance] || 'Konverteret opskrift'}`,
    result.readyInMinutes ? `Tid: ${result.readyInMinutes} min.` : '',
    result.servings ? `Portioner: ${result.servings}` : '',
    '',
    'INGREDIENSER',
    '------------',
    ...(result.ingredients || []).map(i => `• ${i}`),
    '',
    'FREMGANGSMÅDE',
    '-------------',
    ...(result.steps || []).map((s, i) => `${i + 1}. ${s.replace(/^Trin \d+[:.]?\s*/i, '')}`),
  ]

  if (result.substitutions?.length) {
    lines.push('', 'ERSTATNINGER', '------------')
    result.substitutions.forEach(s => {
      lines.push(`• ${s.original} → ${s.replacement}${s.note ? ` (${s.note})` : ''}`)
    })
  }

  if (result.conversionNotes) {
    lines.push('', 'NOTER', '-----', result.conversionNotes)
  }

  lines.push('', '---', 'Konverteret med Mavro — mavro.dk')

  const blob = new Blob([lines.filter(l => l !== undefined).join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${result.title.toLowerCase().replace(/\s+/g, '-')}-${INTOLERANCE_LABEL[intolerance]?.toLowerCase().replace(/\s+/g, '-') || 'konverteret'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function saveToLocalStorage(result, intolerance) {
  const key = 'mavro_cookbook'
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  const entry = {
    id: Date.now(),
    title: result.title,
    intolerance,
    savedAt: new Date().toISOString(),
    recipe: result,
  }
  localStorage.setItem(key, JSON.stringify([entry, ...existing]))
  return true
}

export default function ConverterResult({ result, intolerance, onReset }) {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveToLocalStorage(result, intolerance)
    setSaved(true)
  }

  const substitutedIngredients = new Set(
    (result.substitutions || []).map(s => s.original?.toLowerCase())
  )

  function isSubstituted(ingredient) {
    const lower = ingredient.toLowerCase()
    return [...substitutedIngredients].some(orig => lower.includes(orig))
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              backgroundColor: GREEN,
              color: CREAM,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke={CREAM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {INTOLERANCE_LABEL[intolerance] || 'Konverteret'}
          </span>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {result.readyInMinutes && (
              <span style={{ color: GREEN, fontSize: '14px', fontWeight: 500, opacity: 0.8 }}>
                {result.readyInMinutes} min.
              </span>
            )}
            {result.servings && (
              <span style={{ color: GREEN, fontSize: '14px', fontWeight: 500, opacity: 0.8 }}>
                {result.servings} portioner
              </span>
            )}
          </div>
        </div>
        <h2 style={{ color: DARK_GREEN, fontSize: '32px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
          {result.title}
        </h2>
      </div>

      {/* Substitutioner */}
      {result.substitutions?.length > 0 && (
        <div
          style={{
            marginBottom: '40px',
            padding: '24px',
            borderRadius: '20px',
            backgroundColor: 'rgba(49,94,74,0.07)',
            border: `1px solid rgba(49,94,74,0.12)`,
          }}
        >
          <h3 style={{ color: DARK_GREEN, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>
            Erstatninger
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.substitutions.map((sub, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                  <span style={{ color: '#888', fontSize: '14px', textDecoration: 'line-through' }}>{sub.original}</span>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                    <path d="M1 5h12M9 1l4 4-4 4" stroke={DARK_GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: GREEN, fontSize: '14px', fontWeight: 600 }}>{sub.replacement}</span>
                  {sub.ratio && sub.ratio !== '1:1' && (
                    <span style={{ fontSize: '12px', color: '#888' }}>({sub.ratio})</span>
                  )}
                </div>
                {sub.note && (
                  <span style={{ color: '#888', fontSize: '13px', fontStyle: 'italic', flexShrink: 0, maxWidth: '180px', textAlign: 'right' }}>
                    {sub.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredienser */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: DARK_GREEN, fontSize: '20px', fontWeight: 700, margin: '0 0 16px 0' }}>Ingredienser</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(result.ingredients || []).map((ing, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: isSubstituted(ing) ? 'rgba(239,186,90,0.12)' : 'rgba(49,94,74,0.04)',
                border: isSubstituted(ing) ? `1px solid rgba(239,186,90,0.3)` : '1px solid transparent',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isSubstituted(ing) ? GOLD : GREEN,
                  flexShrink: 0,
                  marginTop: '7px',
                }}
              />
              <span style={{ color: DARK_GREEN, fontSize: '15px', lineHeight: 1.5 }}>{ing}</span>
              {isSubstituted(ing) && (
                <span style={{ marginLeft: 'auto', color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', flexShrink: 0, paddingTop: '2px' }}>
                  ERSTATTET
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Fremgangsmåde */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: DARK_GREEN, fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0' }}>Fremgangsmåde</h3>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(result.steps || []).map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: GREEN,
                  color: CREAM,
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {i + 1}
              </span>
              <p style={{ color: DARK_GREEN, fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                {step.replace(/^Trin \d+[:.]?\s*/i, '')}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Konverteringsnoter */}
      {result.conversionNotes && (
        <div
          style={{
            marginBottom: '40px',
            padding: '20px 24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(239,186,90,0.1)',
            border: `1px solid rgba(239,186,90,0.25)`,
          }}
        >
          <p style={{ color: DARK_GREEN, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            <strong>Note:</strong> {result.conversionNotes}
          </p>
        </div>
      )}

      {/* Handlingsknapper */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          disabled={saved}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '14px 24px',
            borderRadius: '100px',
            backgroundColor: saved ? 'rgba(49,94,74,0.12)' : GREEN,
            color: saved ? GREEN : CREAM,
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: saved ? 'default' : 'pointer',
            transition: 'background-color 0.2s ease, transform 0.15s ease',
            transform: 'none',
          }}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.backgroundColor = '#1B3A28' }}
          onMouseLeave={e => { if (!saved) e.currentTarget.style.backgroundColor = GREEN }}
        >
          {saved ? '✓ Gemt i kogebogen' : 'Gem i min kogebog'}
        </button>

        <button
          onClick={() => downloadTxt(result, intolerance)}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '14px 24px',
            borderRadius: '100px',
            backgroundColor: 'transparent',
            color: GREEN,
            border: `2px solid ${GREEN}`,
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = CREAM }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = GREEN }}
        >
          Download .txt
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '14px 24px',
            borderRadius: '100px',
            backgroundColor: 'transparent',
            color: '#888',
            border: '2px solid rgba(0,0,0,0.1)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.color = GREEN }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#888' }}
        >
          Konverter ny opskrift
        </button>
      </div>
    </div>
  )
}
