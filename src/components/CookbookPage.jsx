import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import ConverterResult from './ConverterResult'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'
const TEXT_MUTED = 'rgba(239, 238, 233, 0.50)'
const INACTIVE_BG = 'rgba(26, 225, 122, 0.10)'
const INACTIVE_BORDER = 'rgba(26, 225, 122, 0.20)'

const INTOLERANCE_LABEL = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Glutenfri & laktosefri',
}

function loadCookbook() {
  try { return JSON.parse(localStorage.getItem('mavro_cookbook') || '[]') } catch { return [] }
}

function deleteEntry(id) {
  const entries = loadCookbook().filter(e => e.id !== id)
  localStorage.setItem('mavro_cookbook', JSON.stringify(entries))
  return entries
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return '' }
}

export default function CookbookPage() {
  const [entries, setEntries] = useState(loadCookbook)
  const [activeEntry, setActiveEntry] = useState(null)

  useEffect(() => { setEntries(loadCookbook()) }, [])

  function handleDelete(id) {
    if (activeEntry?.id === id) setActiveEntry(null)
    setEntries(deleteEntry(id))
  }

  if (activeEntry) {
    return <ConverterResult result={activeEntry.recipe} intolerance={activeEntry.intolerance} onReset={() => setActiveEntry(null)} backLabel="Tilbage til gemte opskrifter" onBack={() => setActiveEntry(null)} />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>

      <style>{`.mavro-header-sub { padding: 32px 80px; } @media (max-width: 768px) { .mavro-header-sub { padding: 20px 16px; } }`}</style>
      <header className="mavro-header-sub" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden"><Logo height={79} /></Link>
      </header>

      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '48px 24px 80px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: TEXT, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: 0, margin: '0 0 16px 0' }}>
            Gemte opskrifter
          </h1>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '14px 18px', borderRadius: '10px',
            backgroundColor: INACTIVE_BG, border: `1px solid ${INACTIVE_BORDER}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M8 7v4M8 5.5v.5"/>
            </svg>
            <p style={{ color: TEXT_DIM, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Dine opskrifter gemmes lokalt i din browser og forsvinder ved rydning af browserdata.
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: INACTIVE_BG,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6h16v24H10z"/>
                <path d="M14 12h8M14 17h8M14 22h5"/>
              </svg>
            </div>
            <h2 style={{ color: TEXT, fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>Din kogebog er tom</h2>
            <p style={{ color: TEXT_DIM, fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px' }}>
              Konverter din første opskrift og gem den her.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-block', padding: '14px 28px', borderRadius: '100px',
                backgroundColor: ACCENT, color: '#000', fontSize: '15px', fontWeight: 700, textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Gå til konverteren
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {entries.map(entry => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: INACTIVE_BG,
                  border: `1px solid ${INACTIVE_BORDER}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                }}
                onClick={() => setActiveEntry(entry)}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(26,225,122,0.15)'; e.currentTarget.style.borderColor = 'rgba(26,225,122,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = INACTIVE_BG; e.currentTarget.style.borderColor = INACTIVE_BORDER }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: 'rgba(26,225,122,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h10v16H6z"/>
                    <path d="M9 8h4M9 11h4M9 14h2"/>
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: TEXT, fontSize: '16px', fontWeight: 700, margin: '0 0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {entry.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '100px',
                      backgroundColor: 'rgba(26,225,122,0.15)', color: ACCENT, fontSize: '12px', fontWeight: 600,
                    }}>
                      {INTOLERANCE_LABEL[entry.intolerance] || entry.intolerance}
                    </span>
                    {entry.savedAt && <span style={{ color: TEXT_MUTED, fontSize: '12px' }}>{formatDate(entry.savedAt)}</span>}
                    {entry.recipe?.readyInMinutes && <span style={{ color: TEXT_MUTED, fontSize: '12px' }}>{entry.recipe.readyInMinutes} min.</span>}
                  </div>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); handleDelete(entry.id) }}
                  aria-label="Slet opskrift"
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                    backgroundColor: 'transparent', color: TEXT_MUTED, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,50,50,0.15)'; e.currentTarget.style.color = '#ff8080' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = TEXT_MUTED }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 4h10M6 4V3h4v1M5 4v8h6V4"/><path d="M7 7v3M9 7v3"/>
                  </svg>
                </button>

                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
