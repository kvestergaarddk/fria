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
      borderRadius: '8px',
      border: '2px solid #1AE17A',
      padding: '28px 32px',
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

function scaleIngredient(ing, factor) {
  if (factor === 1) return ing
  return ing.replace(/^(\d+(?:[,.]\d+)?)/, (match, num) => {
    const parsed = parseFloat(num.replace(',', '.'))
    if (isNaN(parsed)) return match
    const scaled = parsed * factor
    if (scaled === Math.round(scaled)) return String(Math.round(scaled))
    const r = Math.round(scaled * 4) / 4
    return r % 1 === 0 ? String(r) : r.toFixed(1).replace(/\.0$/, '')
  })
}

export default function ConverterResult({ result, intolerance, onReset, onBack, backLabel }) {
  const [saved, setSaved] = useState(false)
  const baseServings = result.servings || 4
  const [servings, setServings] = useState(baseServings)
  const factor = servings / baseServings

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
      <style>{`.mavro-result-header { padding: 32px 80px; } @media (max-width: 768px) { .mavro-result-header { padding: 20px 16px; } }`}</style>
      <header className="mavro-result-header" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden"><Logo height={79} /></Link>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', width: '100%', padding: '32px 24px 80px' }}>

        {/* Intolerance badges + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {intolerances.map(key => (
            <span key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '8px 16px', borderRadius: '32px',
              backgroundColor: 'rgba(26, 225, 122, 0.30)',
              color: '#000', fontSize: '16px', fontWeight: 600,
            }}>
              {key === 'gluten' ? (
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M32.4713 10.3724L27.9232 13.3333C27.7511 12.2527 27.3973 11.2093 26.8756 10.2636L24 5.05615L21.1245 10.2636C20.6027 11.2079 20.249 12.2513 20.0769 13.3333L15.5288 10.3724V16.33C15.5288 17.0155 15.6348 17.6845 15.8344 18.3191L15.5288 18.1209V24.0786C15.5288 24.7641 15.6348 25.4331 15.8344 26.0677L15.5288 25.8695V31.8271C15.5288 34.0681 16.6507 36.1371 18.5283 37.3594L23.2498 40.4333V47.1783H24.7503V40.4333L29.4718 37.3594C31.3508 36.1371 32.4713 34.0681 32.4713 31.8271V25.8695L32.1657 26.0677C32.3653 25.4331 32.4713 24.7641 32.4713 24.0786V18.1209L32.1657 18.3191C32.3653 17.6845 32.4713 17.0155 32.4713 16.33V10.3724ZM24.7503 23.1453V19.9531C24.7503 18.2214 25.6175 16.6232 27.0684 15.6775L30.9722 13.1364V16.3286C30.9722 18.0603 30.105 19.6585 28.6541 20.6042L24.7503 23.1453ZM22.4363 10.989L23.9987 8.15888L25.561 10.989C26.1075 11.9774 26.4338 13.0965 26.5177 14.2459L26.2479 14.4208C25.2788 15.0512 24.5135 15.9074 23.9973 16.8958C23.4811 15.9074 22.7157 15.0512 21.7466 14.4208L21.4768 14.2459C21.5608 13.0952 21.8871 11.9774 22.4335 10.989H22.4363ZM17.0279 13.1378L20.9317 15.6789C22.384 16.6232 23.2498 18.2214 23.2498 19.9545V23.1467L19.346 20.6056C17.8937 19.6613 17.0279 18.0631 17.0279 16.33V13.1378ZM17.0279 24.0786V20.8864L20.9317 23.4275C22.384 24.3718 23.2498 25.9699 23.2498 27.703V30.8952L21.7508 29.9192C21.7508 29.9192 21.7508 29.9192 21.7494 29.9192L19.346 28.3541C17.8951 27.4098 17.0279 25.8116 17.0279 24.08V24.0786ZM17.0279 31.8271V28.6349L18.5269 29.6109L20.9317 31.176C22.3826 32.1203 23.2485 33.7185 23.2485 35.4502V38.6424L19.3446 36.1013C17.8923 35.157 17.0265 33.5588 17.0265 31.8258L17.0279 31.8271ZM30.9722 31.8271C30.9722 33.5588 30.105 35.157 28.6541 36.1027L24.7503 38.6438V35.4516C24.7503 33.7199 25.6161 32.1217 27.067 31.1774L29.4718 29.6123L30.9722 28.6363V31.8285V31.8271ZM26.2507 29.9179L24.7503 30.8938V27.7016C24.7503 25.9699 25.6175 24.3718 27.0684 23.4261L30.9722 20.885V24.0772C30.9722 25.8089 30.105 27.4071 28.6541 28.3527L27.2129 29.2902L26.2493 29.9165L26.2507 29.9179Z" fill="#000"/>
                  <path d="M33.3716 15.6885L41.2895 7.77201L40.2281 6.71069L33.3716 13.5672V15.6885Z" fill="#000"/>
                  <path d="M14.6421 32.2964L6.71045 40.228L7.77176 41.2893L14.9752 34.0859C14.7949 33.5119 14.6806 32.9117 14.6435 32.2964H14.6421Z" fill="#000"/>
                  <path d="M24 48C10.7659 48 0 37.2341 0 24C0 10.7659 10.7659 0 24 0C37.2341 0 48 10.7659 48 24C48 37.2341 37.2341 48 24 48ZM24 1.50043C11.5932 1.50043 1.50043 11.5932 1.50043 24C1.50043 36.4068 11.5932 46.4996 24 46.4996C36.4068 46.4996 46.4996 36.4068 46.4996 24C46.4996 11.5932 36.4068 1.50043 24 1.50043Z" fill="#000"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M12.4534 34.4851L6.71045 40.228L7.77176 41.288L13.0508 36.0089C12.8195 35.5175 12.6186 35.0096 12.4534 34.4851Z" fill="#000"/>
                  <path d="M23.9999 42.0712C17.8261 42.0712 12.8018 37.0482 12.8018 30.8731C12.8018 21.4176 22.9538 6.86206 23.386 6.24675L23.9999 5.37402L24.6139 6.24675C25.0461 6.86206 35.1981 21.4176 35.1981 30.8731C35.1981 37.0469 30.1751 42.0712 23.9999 42.0712ZM23.9999 8.01698C21.7796 11.3592 14.3022 23.1878 14.3022 30.8745C14.3022 36.2223 18.6521 40.5722 23.9999 40.5722C29.3478 40.5722 33.6977 36.2223 33.6977 30.8745C33.6977 23.1878 26.2203 11.3606 23.9999 8.01698Z" fill="#000"/>
                  <path d="M29.8255 31.5627C29.5103 34.2401 27.3863 36.3709 24.7117 36.6958C24.3703 36.7371 24.0853 37 24.0413 37.3414C23.9766 37.8397 24.3964 38.2444 24.8768 38.188C28.2521 37.786 30.935 35.0921 31.3191 31.71C31.3686 31.2695 31.0148 30.8882 30.5716 30.8882C30.1862 30.8882 29.8709 31.1814 29.8255 31.5641V31.5627Z" fill="#000"/>
                  <path d="M31.9951 17.0663L41.2895 7.77185L40.2282 6.71191L31.2876 15.6525C31.5257 16.1164 31.7625 16.5872 31.9951 17.0663Z" fill="#000"/>
                  <path d="M24 48C10.7659 48 0 37.2341 0 24C0 10.7659 10.7659 0 24 0C37.2341 0 48 10.7659 48 24C48 37.2341 37.2341 48 24 48ZM24 1.50043C11.5932 1.50043 1.50043 11.5932 1.50043 24C1.50043 36.4068 11.5932 46.4996 24 46.4996C36.4068 46.4996 46.4996 36.4054 46.4996 24C46.4996 11.5946 36.4068 1.50043 24 1.50043Z" fill="#000"/>
                </svg>
              )}
              {INTOLERANCE_LABEL[key]}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l4 4 6-7"/>
              </svg>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ color: TEXT, fontSize: '18px', fontWeight: 700, margin: 0 }}>Ingredienser</h2>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select
                  value={servings}
                  onChange={e => setServings(Number(e.target.value))}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    padding: '6px 32px 6px 14px',
                    borderRadius: '100px',
                    border: 'none',
                    backgroundColor: TEXT,
                    color: PAGE_BG,
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'person' : 'personer'}</option>
                  ))}
                </select>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }}>
                  <path d="M1 1l4 4 4-4" stroke={PAGE_BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(result.ingredients || []).map((ing, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {isSubstituted(ing) && (
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, marginTop: '9px' }} />
                  )}
                  <span style={{ color: TEXT, fontSize: '16px', lineHeight: '26px', fontWeight: isSubstituted(ing) ? 600 : 400 }}>{scaleIngredient(ing, factor)}</span>
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
