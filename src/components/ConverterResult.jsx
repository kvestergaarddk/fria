import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

const PAGE_BG = '#EFEEE9'
const DARK = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#1B3A28'
const TEXT_DIM = 'rgba(27, 58, 40, 0.65)'
const CARD_BORDER = 'rgba(26, 225, 122, 0.40)'
const CARD_BG = 'rgba(255, 255, 255, 0.70)'

const INTOLERANCE_LABEL = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Glutenfri & laktosefri',
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      borderRadius: '14px',
      border: `1px solid ${CARD_BORDER}`,
      padding: '28px 32px',
      backgroundColor: CARD_BG,
      ...style,
    }}>
      {children}
    </div>
  )
}

function downloadTxt(result, intolerance) {
  const label = INTOLERANCE_LABEL[intolerance] || 'Konverteret'
  const lines = [
    result.title,
    '='.repeat(result.title.length),
    '',
    label,
    result.readyInMinutes ? `Tid: ${result.readyInMinutes} min.` : '',
    result.servings ? `Portioner: ${result.servings}` : '',
    '',
    'ERSTATNINGER',
    '------------',
    ...(result.substitutions || []).map(s =>
      `• ${s.original} → ${s.replacement}${s.ratio && s.ratio !== '1:1' ? ` (${s.ratio})` : ''}${s.note ? ` — ${s.note}` : ''}`
    ),
    '',
    'INGREDIENSER',
    '------------',
    ...(result.ingredients || []).map(i => `• ${i}`),
    '',
    'FREMGANGSMÅDE',
    '-------------',
    ...(result.steps || []).map((s, i) => `${i + 1}. ${s.replace(/^Trin \d+[:.]?\s*/i, '')}`),
  ]
  if (result.conversionNotes) lines.push('', 'NOTER', '-----', result.conversionNotes)
  lines.push('', '---', 'Konverteret med Mavro — mavro.dk')

  const blob = new Blob([lines.filter(Boolean).join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${result.title.toLowerCase().replace(/\s+/g, '-')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function saveToLocalStorage(result, intolerance) {
  const key = 'mavro_cookbook'
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify([
    { id: Date.now(), title: result.title, intolerance, savedAt: new Date().toISOString(), recipe: result },
    ...existing,
  ]))
}

export default function ConverterResult({ result, intolerance, onReset }) {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveToLocalStorage(result, intolerance)
    setSaved(true)
  }

  const substitutedNames = new Set((result.substitutions || []).map(s => s.original?.toLowerCase()))
  function isSubstituted(ing) {
    return [...substitutedNames].some(n => ing.toLowerCase().includes(n))
  }

  const intolerances = intolerance === 'begge'
    ? ['gluten', 'laktose']
    : intolerance ? [intolerance] : []

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAGE_BG }}>
      <header className="pt-8 pb-4 flex flex-col items-start px-6 md:px-10">
        <Link to="/" aria-label="Gå til forsiden"><Logo height={44} /></Link>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', width: '100%', padding: '32px 24px 80px' }}>

        {/* Intolerance badges + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {intolerances.map(key => (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '100px',
              backgroundColor: 'rgba(26, 225, 122, 0.15)',
              border: `1px solid rgba(26, 225, 122, 0.30)`,
              color: DARK, fontSize: '13px', fontWeight: 600,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke={ACCENT} strokeWidth="1.5"/>
                <path d="M4.5 7l2 2 3-3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {INTOLERANCE_LABEL[key]}
            </span>
          ))}
          {result.readyInMinutes && <span style={{ color: TEXT_DIM, fontSize: '14px', fontWeight: 500 }}>{result.readyInMinutes} minutter</span>}
          {result.servings && <span style={{ color: TEXT_DIM, fontSize: '14px', fontWeight: 500 }}>{result.servings} personer</span>}
        </div>

        {/* Title */}
        <h1 style={{
          color: TEXT,
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '0 0 32px 0',
        }}>
          {result.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Erstatninger */}
          {result.substitutions?.length > 0 && (
            <Card>
              <h2 style={{ color: TEXT, fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Erstatninger</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.substitutions.map((sub, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ color: TEXT_DIM, fontSize: '16px', textDecoration: 'line-through' }}>{sub.original}</span>
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
                        <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ color: DARK, fontSize: '16px', fontWeight: 700 }}>
                        {sub.replacement}
                        {sub.ratio && sub.ratio !== '1:1' && <span style={{ fontSize: '13px', fontWeight: 400, color: TEXT_DIM, marginLeft: '5px' }}>({sub.ratio})</span>}
                      </span>
                    </div>
                    {sub.note && <p style={{ color: TEXT_DIM, fontSize: '13px', lineHeight: 1.5, margin: '4px 0 0 0' }}>{sub.note}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Ingredienser */}
          <Card>
            {result.servings && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '100px',
                backgroundColor: TEXT, color: PAGE_BG,
                fontSize: '13px', fontWeight: 600,
                marginBottom: '16px',
              }}>
                {result.servings} personer
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke={PAGE_BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <h2 style={{ color: TEXT, fontSize: '18px', fontWeight: 700, margin: `0 0 14px 0` }}>Ingredienser</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(result.ingredients || []).map((ing, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {isSubstituted(ing) && (
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, marginTop: '9px' }} />
                  )}
                  <span style={{ color: TEXT, fontSize: '16px', lineHeight: '26px', fontWeight: isSubstituted(ing) ? 600 : 400 }}>{ing}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSave}
              disabled={saved}
              style={{
                padding: '12px 24px',
                borderRadius: '100px',
                backgroundColor: saved ? 'rgba(26,225,122,0.15)' : TEXT,
                color: saved ? ACCENT : PAGE_BG,
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: saved ? 'default' : 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => { if (!saved) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {saved ? '✓ Gemt i kogebogen' : 'Gem opskriften'}
            </button>
          </Card>

          {/* Sådan gør du */}
          <Card>
            <h2 style={{ color: TEXT, fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0' }}>Sådan gør du</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(result.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontSize: '36px', fontFamily: 'Knewave, cursive', fontWeight: 400, lineHeight: 1, flexShrink: 0, minWidth: '28px' }}>{i + 1}</span>
                  <p style={{ color: TEXT, fontSize: '16px', fontWeight: 400, lineHeight: '26px', paddingTop: '5px', margin: 0 }}>
                    {step.replace(/^Trin \d+[:.]?\s*/i, '')}
                  </p>
                </div>
              ))}
              <p style={{ color: ACCENT, fontSize: '22px', fontFamily: 'Knewave, cursive', fontWeight: 400, lineHeight: 1, margin: '4px 0 0 48px' }}>Nyd din mad</p>
            </div>
          </Card>

          {/* Note */}
          {result.conversionNotes && (
            <Card>
              <h3 style={{ color: TEXT, fontSize: '15px', fontWeight: 700, margin: '0 0 10px 0' }}>Note</h3>
              <p style={{ color: TEXT_DIM, fontSize: '15px', fontWeight: 400, lineHeight: '24px', margin: 0 }}>{result.conversionNotes}</p>
            </Card>
          )}
        </div>

        {/* Ekstra handlinger */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => downloadTxt(result, intolerance)}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: 'transparent',
              color: TEXT_DIM,
              border: `1.5px solid rgba(27,58,40,0.20)`,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DARK; e.currentTarget.style.color = TEXT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(27,58,40,0.20)'; e.currentTarget.style.color = TEXT_DIM }}
          >
            Download .txt
          </button>

          <button
            onClick={onReset}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: 'transparent',
              color: TEXT_DIM,
              border: `1.5px solid rgba(27,58,40,0.12)`,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(27,58,40,0.25)'; e.currentTarget.style.color = TEXT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(27,58,40,0.12)'; e.currentTarget.style.color = TEXT_DIM }}
          >
            Konverter ny opskrift
          </button>
        </div>
      </main>

      <Footer light />
    </div>
  )
}
