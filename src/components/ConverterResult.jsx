import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

const GREEN = '#204636'
const DARK = '#1B3A28'
const CREAM = '#BFCEA3'
const GOLD = '#EFBA5A'

const INTOLERANCE_LABEL = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Glutenfri & laktosefri',
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
  if (result.conversionNotes) {
    lines.push('', 'NOTER', '-----', result.conversionNotes)
  }
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

  const substitutedNames = new Set(
    (result.substitutions || []).map(s => s.original?.toLowerCase())
  )
  function isSubstituted(ing) {
    return [...substitutedNames].some(n => ing.toLowerCase().includes(n))
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CREAM }}>
      {/* Header */}
      <header className="pt-10 pb-4 flex flex-col items-center px-4">
        <Link to="/" aria-label="Gå til forsiden"><Logo color={GREEN} /></Link>
      </header>

      <main className="max-w-[1220px] mx-auto w-full px-4 md:px-8 pb-8">

        {/* Titel + meta */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: GREEN,
                color: CREAM,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {INTOLERANCE_LABEL[intolerance] || 'Konverteret'}
            </span>
            {result.readyInMinutes && (
              <span style={{ color: GREEN, fontSize: '14px', fontWeight: 500 }}>{result.readyInMinutes} min</span>
            )}
            {result.servings && (
              <span style={{ color: GREEN, fontSize: '14px', fontWeight: 500 }}>{result.servings} personer</span>
            )}
          </div>
          <h1
            style={{
              color: DARK,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {result.title}
          </h1>
        </div>

        {/* Erstatninger — øverst, mest fremtrædende */}
        {result.substitutions?.length > 0 && (
          <div
            style={{
              marginBottom: '48px',
              padding: '28px 32px',
              borderRadius: '24px',
              backgroundColor: 'rgba(239,186,90,0.12)',
              border: `1.5px solid rgba(239,186,90,0.35)`,
            }}
          >
            <h2 style={{ color: DARK, fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0' }}>
              Erstatninger
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {result.substitutions.map((sub, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px' }}>
                    <span style={{ color: '#999', fontSize: '18px', fontWeight: 400, textDecoration: 'line-through' }}>
                      {sub.original}
                    </span>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <path d="M1 5h14M10 1l5 4-5 4" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: GREEN, fontSize: '18px', fontWeight: 700 }}>
                      {sub.replacement}
                      {sub.ratio && sub.ratio !== '1:1' && (
                        <span style={{ fontSize: '14px', fontWeight: 400, color: '#888', marginLeft: '6px' }}>({sub.ratio})</span>
                      )}
                    </span>
                  </div>
                  {sub.note && (
                    <span style={{ color: '#777', fontSize: '14px', fontStyle: 'italic', alignSelf: 'center' }}>
                      {sub.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* To-kolonne: Ingredienser + Fremgangsmåde */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 mb-10">

          {/* Ingredienser */}
          <aside className="md:w-[400px] md:flex-shrink-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ color: GREEN, fontSize: '20px', fontWeight: 700, margin: 0 }}>Ingredienser</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(result.ingredients || []).map((ing, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '4px 0',
                      borderBottom: '1px solid rgba(49,94,74,0.08)',
                    }}
                  >
                    {isSubstituted(ing) && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: GOLD,
                          flexShrink: 0,
                          marginTop: '9px',
                        }}
                      />
                    )}
                    <span
                      style={{
                        color: GREEN,
                        fontSize: '20px',
                        fontWeight: isSubstituted(ing) ? 600 : 400,
                        lineHeight: '28px',
                      }}
                    >
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Divider */}
          <div className="block md:hidden" style={{ height: '1px', backgroundColor: GREEN }} />
          <div className="hidden md:block" style={{ width: '1px', backgroundColor: GREEN, flexShrink: 0 }} />

          {/* Fremgangsmåde */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ color: GREEN, fontSize: '30px', fontWeight: 700, margin: 0 }}>Sådan gør du</h2>
            {(result.steps || []).map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    color: GREEN,
                    fontSize: '40px',
                    fontFamily: 'Knewave, cursive',
                    fontWeight: 400,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ color: GREEN, fontSize: '20px', fontWeight: 400, lineHeight: '28px', paddingTop: '8px', margin: 0 }}>
                  {step.replace(/^Trin \d+[:.]?\s*/i, '')}
                </p>
              </div>
            ))}
            <div style={{ paddingLeft: '52px' }}>
              <p style={{ color: GREEN, fontSize: '20px', fontFamily: 'Knewave, cursive', fontWeight: 400, lineHeight: '28px', margin: 0 }}>
                Nyd din mad
              </p>
            </div>
          </section>
        </div>

        {/* Konverteringsnoter — nederst, vigtig */}
        {result.conversionNotes && (
          <div
            style={{
              marginBottom: '48px',
              padding: '24px 32px',
              borderRadius: '20px',
              backgroundColor: 'rgba(49,94,74,0.06)',
              border: '1px solid rgba(49,94,74,0.12)',
            }}
          >
            <h3 style={{ color: DARK, fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Note</h3>
            <p style={{ color: GREEN, fontSize: '18px', fontWeight: 400, lineHeight: '28px', margin: 0 }}>
              {result.conversionNotes}
            </p>
          </div>
        )}

        {/* Handlingsknapper */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '16px' }}>
          <button
            onClick={handleSave}
            disabled={saved}
            style={{
              padding: '14px 28px',
              borderRadius: '100px',
              backgroundColor: saved ? 'rgba(49,94,74,0.1)' : GREEN,
              color: saved ? GREEN : CREAM,
              border: 'none',
              fontSize: '16px',
              fontWeight: 700,
              cursor: saved ? 'default' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => { if (!saved) e.currentTarget.style.backgroundColor = DARK }}
            onMouseLeave={e => { if (!saved) e.currentTarget.style.backgroundColor = GREEN }}
          >
            {saved ? '✓ Gemt i kogebogen' : 'Gem i min kogebog'}
          </button>

          <button
            onClick={() => downloadTxt(result, intolerance)}
            style={{
              padding: '14px 28px',
              borderRadius: '100px',
              backgroundColor: 'transparent',
              color: GREEN,
              border: `2px solid ${GREEN}`,
              fontSize: '16px',
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
              padding: '14px 28px',
              borderRadius: '100px',
              backgroundColor: 'transparent',
              color: '#888',
              border: '2px solid rgba(0,0,0,0.12)',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.color = GREEN }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#888' }}
          >
            Konverter ny opskrift
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
