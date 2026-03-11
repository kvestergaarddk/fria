import { useState, useRef } from 'react'
import ConverterResult from './ConverterResult'

const GREEN = '#315E4A'
const DARK_GREEN = '#1B3A28'
const CREAM = '#EEDDB6'
const GOLD = '#EFBA5A'
const BG = '#EEDDB6'

const INPUT_TABS = [
  { id: 'url', label: 'Link', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 9.5a3.54 3.54 0 005 0l2-2a3.536 3.536 0 00-5-5l-1 1"/>
      <path d="M9.5 6.5a3.54 3.54 0 00-5 0l-2 2a3.536 3.536 0 005 5l1-1"/>
    </svg>
  )},
  { id: 'text', label: 'Tekst', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M2 4h12M2 8h8M2 12h10"/>
    </svg>
  )},
  { id: 'billede', label: 'Billede', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2"/>
      <circle cx="5.5" cy="6" r="1.5"/>
      <path d="M1.5 11l3.5-3.5 3 3 2-2 4 4"/>
    </svg>
  )},
]

const INTOLERANCE_OPTIONS = [
  { id: 'gluten', label: 'Glutenfri' },
  { id: 'laktose', label: 'Laktosefri' },
  { id: 'begge', label: 'Glutenfri & laktosefri' },
]

export default function ConverterPage() {
  const [activeTab, setActiveTab] = useState('url')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imageName, setImageName] = useState('')
  const [intolerance, setIntolerance] = useState('gluten')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setImageData(ev.target.result)
    reader.readAsDataURL(file)
  }

  function getContent() {
    if (activeTab === 'url') return urlInput.trim()
    if (activeTab === 'text') return textInput.trim()
    if (activeTab === 'billede') return imageData
    return ''
  }

  function isValid() {
    if (activeTab === 'url') return urlInput.trim().startsWith('http')
    if (activeTab === 'text') return textInput.trim().length > 20
    if (activeTab === 'billede') return !!imageData
    return false
  }

  async function handleConvert() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: activeTab === 'billede' ? 'image' : activeTab,
          content: getContent(),
          intolerance,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Noget gik galt')
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
    setUrlInput('')
    setTextInput('')
    setImageData(null)
    setImageName('')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        {result ? (
          <ConverterResult result={result} intolerance={intolerance} onReset={handleReset} />
        ) : (
          <>
            {/* Overskrift */}
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <p style={{ color: GREEN, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px 0', opacity: 0.7 }}>
                Opskriftskonverter
              </p>
              <h1 style={{ color: DARK_GREEN, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
                Konverter en opskrift
              </h1>
              <p style={{ color: GREEN, fontSize: '18px', lineHeight: 1.7, margin: '16px 0 0 0', opacity: 0.75 }}>
                Indsæt et link, skriv en opskrift eller upload et billede — og få den konverteret med præcise erstatninger.
              </p>
            </div>

            {/* Kortboks */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 4px 24px rgba(27,58,40,0.08), 0 1px 4px rgba(27,58,40,0.04)',
              }}
            >
              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  backgroundColor: 'rgba(49,94,74,0.06)',
                  borderRadius: '14px',
                  padding: '4px',
                  marginBottom: '28px',
                }}
              >
                {INPUT_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setError(null) }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                      color: activeTab === tab.id ? DARK_GREEN : 'rgba(49,94,74,0.5)',
                      boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Input-felt */}
              <div style={{ marginBottom: '28px' }}>
                {activeTab === 'url' && (
                  <div>
                    <label style={{ display: 'block', color: DARK_GREEN, fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Link til opskrift
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.valdemarsro.dk/..."
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: `2px solid rgba(49,94,74,0.15)`,
                        backgroundColor: 'rgba(49,94,74,0.03)',
                        color: DARK_GREEN,
                        fontSize: '15px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = GREEN }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(49,94,74,0.15)' }}
                    />
                    <p style={{ color: '#888', fontSize: '13px', margin: '8px 0 0 0' }}>
                      Indsæt et direkte link til en opskrift — fx fra Valdemarsro, Mad.dk eller en udenlandsk opskriftsside.
                    </p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label style={{ display: 'block', color: DARK_GREEN, fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Opskrift som tekst
                    </label>
                    <textarea
                      placeholder={'Indsæt eller skriv opskriften her...\n\nEksempel:\n200g hvedemel\n2 æg\n3 dl mælk\n\n1. Bland mel og æg...\n2. Tilsæt mælk...'}
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      rows={10}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: `2px solid rgba(49,94,74,0.15)`,
                        backgroundColor: 'rgba(49,94,74,0.03)',
                        color: DARK_GREEN,
                        fontSize: '15px',
                        fontFamily: 'inherit',
                        lineHeight: 1.6,
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = GREEN }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(49,94,74,0.15)' }}
                    />
                  </div>
                )}

                {activeTab === 'billede' && (
                  <div>
                    <label style={{ display: 'block', color: DARK_GREEN, fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Billede af opskrift
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        border: `2px dashed ${imageData ? GREEN : 'rgba(49,94,74,0.2)'}`,
                        borderRadius: '12px',
                        padding: '40px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: imageData ? 'rgba(49,94,74,0.04)' : 'rgba(49,94,74,0.02)',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      }}
                      onMouseEnter={e => { if (!imageData) { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.backgroundColor = 'rgba(49,94,74,0.04)' }}}
                      onMouseLeave={e => { if (!imageData) { e.currentTarget.style.borderColor = 'rgba(49,94,74,0.2)'; e.currentTarget.style.backgroundColor = 'rgba(49,94,74,0.02)' }}}
                    >
                      {imageData ? (
                        <div>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(49,94,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 12l4 4 9-9"/>
                            </svg>
                          </div>
                          <p style={{ color: GREEN, fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{imageName}</p>
                          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Klik for at vælge et andet billede</p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(49,94,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="18" height="18" rx="3"/>
                              <circle cx="8" cy="8" r="2"/>
                              <path d="M2 14l5-5 4 4 3-3 6 6"/>
                            </svg>
                          </div>
                          <p style={{ color: DARK_GREEN, fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>Klik for at uploade billede</p>
                          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>JPG, PNG eller HEIC — fx fra en kogebog eller et håndskrevet kort</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              {/* Intoleransvælger */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: DARK_GREEN, fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                  Hvad skal undgås?
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {INTOLERANCE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setIntolerance(opt.id)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '100px',
                        border: `2px solid ${intolerance === opt.id ? GREEN : 'rgba(49,94,74,0.2)'}`,
                        backgroundColor: intolerance === opt.id ? GREEN : 'transparent',
                        color: intolerance === opt.id ? CREAM : GREEN,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fejlbesked */}
              {error && (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(200,50,50,0.07)',
                    border: '1px solid rgba(200,50,50,0.2)',
                    color: '#a02020',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Konverter-knap */}
              <button
                onClick={handleConvert}
                disabled={!isValid() || loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: isValid() && !loading ? GREEN : 'rgba(49,94,74,0.2)',
                  color: isValid() && !loading ? CREAM : 'rgba(49,94,74,0.4)',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: isValid() && !loading ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s ease, transform 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onMouseEnter={e => { if (isValid() && !loading) e.currentTarget.style.backgroundColor = DARK_GREEN }}
                onMouseLeave={e => { if (isValid() && !loading) e.currentTarget.style.backgroundColor = GREEN }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid rgba(238,221,182,0.3)`,
                        borderTopColor: CREAM,
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    Konverterer…
                  </>
                ) : (
                  'Konverter opskrift'
                )}
              </button>
            </div>

            {/* Info-sektion */}
            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[
                { icon: '🔗', title: 'Indsæt link', text: 'Kopier et link fra din yndlingsopskriftsside og indsæt det.' },
                { icon: '✍️', title: 'Skriv eller paste', text: 'Skriv en opskrift direkte eller kopier fra et dokument.' },
                { icon: '📷', title: 'Tag et billede', text: 'Fotografer en side fra en kogebog eller et håndskrevet kort.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(49,94,74,0.08)',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                  <h3 style={{ color: DARK_GREEN, fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>{item.title}</h3>
                  <p style={{ color: GREEN, fontSize: '14px', lineHeight: 1.6, margin: 0, opacity: 0.8 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
