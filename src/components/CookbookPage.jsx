import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ConverterResult from './ConverterResult'

const GREEN = '#315E4A'
const DARK_GREEN = '#1B3A28'
const CREAM = '#EEDDB6'

const INTOLERANCE_LABEL = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Glutenfri & laktosefri',
}

function loadCookbook() {
  try {
    return JSON.parse(localStorage.getItem('mavro_cookbook') || '[]')
  } catch {
    return []
  }
}

function deleteEntry(id) {
  const entries = loadCookbook().filter(e => e.id !== id)
  localStorage.setItem('mavro_cookbook', JSON.stringify(entries))
  return entries
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function CookbookPage() {
  const [entries, setEntries] = useState(loadCookbook)
  const [activeEntry, setActiveEntry] = useState(null)

  // Opdater ved navigation hertil
  useEffect(() => {
    setEntries(loadCookbook())
  }, [])

  function handleDelete(id) {
    if (activeEntry?.id === id) setActiveEntry(null)
    setEntries(deleteEntry(id))
  }

  if (activeEntry) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: CREAM, paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <button
            onClick={() => setActiveEntry(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: GREEN,
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0',
              marginBottom: '32px',
              opacity: 0.7,
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5"/>
            </svg>
            Tilbage til kogebogen
          </button>
          <ConverterResult
            result={activeEntry.recipe}
            intolerance={activeEntry.intolerance}
            onReset={() => setActiveEntry(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: CREAM, paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: GREEN, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px 0', opacity: 0.7 }}>
            Min kogebog
          </p>
          <h1 style={{ color: DARK_GREEN, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px 0' }}>
            Gemte opskrifter
          </h1>

          {/* Info-banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(49,94,74,0.07)',
              border: '1px solid rgba(49,94,74,0.12)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M8 7v4M8 5.5v.5"/>
            </svg>
            <p style={{ color: GREEN, fontSize: '13px', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
              Dine opskrifter gemmes lokalt i din browser og forsvinder ved rydning af browserdata.
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          /* Tom tilstand */
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(49,94,74,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6h16v24H10z"/>
                <path d="M14 12h8M14 17h8M14 22h5"/>
              </svg>
            </div>
            <h2 style={{ color: DARK_GREEN, fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
              Din kogebog er tom
            </h2>
            <p style={{ color: GREEN, fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px', opacity: 0.75 }}>
              Konverter din første opskrift og gem den her.
            </p>
            <Link
              to="/konverter"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                borderRadius: '100px',
                backgroundColor: GREEN,
                color: CREAM,
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = DARK_GREEN }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = GREEN }}
            >
              Gå til konverteren
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map(entry => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 2px 12px rgba(27,58,40,0.06)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onClick={() => setActiveEntry(entry)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(27,58,40,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,58,40,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Ikon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(49,94,74,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h10v16H6z"/>
                    <path d="M9 8h4M9 11h4M9 14h2"/>
                  </svg>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: DARK_GREEN,
                      fontSize: '16px',
                      fontWeight: 700,
                      margin: '0 0 4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        backgroundColor: 'rgba(49,94,74,0.08)',
                        color: GREEN,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {INTOLERANCE_LABEL[entry.intolerance] || entry.intolerance}
                    </span>
                    {entry.savedAt && (
                      <span style={{ color: '#999', fontSize: '12px' }}>{formatDate(entry.savedAt)}</span>
                    )}
                    {entry.recipe?.readyInMinutes && (
                      <span style={{ color: '#999', fontSize: '12px' }}>{entry.recipe.readyInMinutes} min.</span>
                    )}
                  </div>
                </div>

                {/* Slet-knap */}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(entry.id) }}
                  aria-label="Slet opskrift"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#ccc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,50,50,0.08)'; e.currentTarget.style.color = '#c04040' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ccc' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 4h10M6 4V3h4v1M5 4v8h6V4"/>
                    <path d="M7 7v3M9 7v3"/>
                  </svg>
                </button>

                {/* Pil */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
