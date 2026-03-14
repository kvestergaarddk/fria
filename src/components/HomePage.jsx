import { useState, useRef } from 'react'
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

const LOADING_MESSAGES = [
  'Henter og læser opskriften…',
  'Identificerer ingredienser…',
  'Finder de bedste erstatninger…',
  'Tilpasser fremgangsmåden…',
  'Næsten klar…',
]

function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0)
  useState(() => {
    const interval = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 3500)
    return () => clearInterval(interval)
  })
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '72px', height: '72px', marginBottom: '36px' }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ animation: 'spin 1.2s linear infinite', position: 'absolute', inset: 0 }}>
          <circle cx="36" cy="36" r="30" stroke="rgba(26,225,122,0.15)" strokeWidth="4"/>
          <path d="M36 6 A30 30 0 0 1 66 36" stroke={ACCENT} strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14h16M14 6l8 8-8 8" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <h2 style={{ color: TEXT, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 16px 0' }}>
        Konverterer opskriften
      </h2>
      <p key={msgIdx} style={{ color: ACCENT, fontSize: '18px', fontWeight: 400, lineHeight: '28px', margin: '0 0 32px 0', animation: 'fadeIn 0.4s ease' }}>
        {LOADING_MESSAGES[msgIdx]}
      </p>
      <p style={{ color: TEXT_MUTED, fontSize: '14px', margin: 0 }}>Det tager typisk 15–30 sekunder</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

function WheatIcon({ active }) {
  const c = active ? '#000' : TEXT_MUTED
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="11"/>
      <path d="M14 20v-9"/>
      <path d="M11 14l3-3 3 3"/>
      <path d="M10.5 17l3.5-1.5 3.5 1.5"/>
    </svg>
  )
}

function MilkIcon({ active }) {
  const c = active ? '#000' : TEXT_MUTED
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 5C14 5 8.5 11 8.5 17a5.5 5.5 0 0011 0C19.5 11 14 5 14 5z"/>
      <path d="M11.2 19.5a2.8 2.8 0 005.6 0"/>
    </svg>
  )
}

function LinkIconSvg({ active }) {
  const c = active ? '#000' : TEXT_MUTED
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L8 4"/>
      <path d="M10 7a3.5 3.5 0 00-5 0L3 9a3.5 3.5 0 005 5l1-1"/>
    </svg>
  )
}

function CameraIconSvg({ active }) {
  const c = active ? '#000' : TEXT_MUTED
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="5" width="14" height="10" rx="2"/>
      <circle cx="8.5" cy="10" r="2.5"/>
      <path d="M6 5l1-2h3l1 2"/>
    </svg>
  )
}

function DocIconSvg({ active }) {
  const c = active ? '#000' : TEXT_MUTED
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="11" height="13" rx="1.5"/>
      <path d="M5.5 6h6M5.5 9h6M5.5 12h4"/>
    </svg>
  )
}

export default function HomePage() {
  const [glutenfri, setGlutenfri] = useState(true)
  const [laktosefri, setLaktosefri] = useState(false)
  const [activeTab, setActiveTab] = useState('url')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imageName, setImageName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  function getIntolerance() {
    if (glutenfri && laktosefri) return 'begge'
    if (laktosefri) return 'laktose'
    return 'gluten'
  }

  function isValid() {
    if (activeTab === 'url') return urlInput.trim().startsWith('http')
    if (activeTab === 'text') return textInput.trim().length > 20
    return !!imageData
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = ev => setImageData(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function handleConvert() {
    setError(null)
    setLoading(true)
    try {
      const content = activeTab === 'url' ? urlInput.trim() : activeTab === 'text' ? textInput.trim() : imageData
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputType: activeTab === 'billede' ? 'image' : activeTab, content, intolerance: getIntolerance() }),
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

  if (result) {
    return <ConverterResult result={result} intolerance={getIntolerance()} onReset={() => { setResult(null); setError(null) }} />
  }

  const toggleStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 28px',
    borderRadius: '10px',
    border: `1.5px solid ${active ? 'transparent' : INACTIVE_BORDER}`,
    backgroundColor: active ? ACCENT : INACTIVE_BG,
    color: active ? '#000' : TEXT,
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.15s ease',
    minWidth: '180px',
    justifyContent: 'center',
  })

  const tabStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '10px',
    border: `1.5px solid ${active ? 'transparent' : INACTIVE_BORDER}`,
    backgroundColor: active ? ACCENT : INACTIVE_BG,
    color: active ? '#000' : TEXT,
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.15s ease',
    flex: 1,
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ padding: '28px 40px 0' }}>
        <Logo height={52} />
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '48px 40px 120px' }}>
        {loading ? <LoadingScreen /> : (
          <>
            {/* Hero */}
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{
                color: TEXT,
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                margin: '0 0 24px 0',
              }}>
                Gør enhver opskrift gluten og laktosefri
              </h1>
              <p style={{
                color: TEXT,
                fontSize: 'clamp(16px, 2.2vw, 30px)',
                fontWeight: 700,
                lineHeight: 1.35,
                margin: 0,
                maxWidth: '900px',
              }}>
                Upload en opskrift, indsæt et link eller tag et billede. Mavro omskriver ingredienser og fremgangsmåde, så opskriften bliver fri for gluten og laktose.
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>

              {/* Intolerance toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%', maxWidth: '720px' }}>
                <p style={{ color: TEXT_DIM, fontSize: '16px', fontWeight: 600, margin: 0 }}>Min opskrift skal være</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    onClick={() => setGlutenfri(g => !g)}
                    style={toggleStyle(glutenfri)}
                    onMouseEnter={e => { if (!glutenfri) e.currentTarget.style.opacity = '0.75' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    <WheatIcon active={glutenfri} />
                    Glutenfri
                    {glutenfri && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l4 4 6-7"/>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setLaktosefri(l => !l)}
                    style={toggleStyle(laktosefri)}
                    onMouseEnter={e => { if (!laktosefri) e.currentTarget.style.opacity = '0.75' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    <MilkIcon active={laktosefri} />
                    Laktosefri
                    {laktosefri && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l4 4 6-7"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Input tabs */}
              <div style={{ width: '100%', maxWidth: '720px', display: 'flex', gap: '10px' }}>
                {[
                  { id: 'url', label: 'Indsæt link', Icon: LinkIconSvg },
                  { id: 'billede', label: 'Upload billede', Icon: CameraIconSvg },
                  { id: 'text', label: 'Indsæt tekst', Icon: DocIconSvg },
                ].map(({ id, label, Icon }) => (
                  <button key={id} style={tabStyle(activeTab === id)} onClick={() => { setActiveTab(id); setError(null) }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '30px', height: '30px', borderRadius: '50%',
                      backgroundColor: activeTab === id ? '#fff' : 'rgba(26,225,122,0.15)',
                      flexShrink: 0,
                    }}>
                      <Icon active={activeTab === id} />
                    </div>
                    {label}
                  </button>
                ))}
              </div>

              {/* Input-felt */}
              <div style={{ width: '100%', maxWidth: '720px' }}>
                {activeTab === 'url' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <label style={{ color: TEXT_DIM, fontSize: '16px', fontWeight: 600 }}>Link til opskrift</label>
                    <input
                      type="url"
                      placeholder="fx. www.mormorsbedsteopskrift.dk"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '20px 0',
                        border: 'none',
                        borderBottom: `2px solid ${ACCENT}`,
                        backgroundColor: 'transparent',
                        color: TEXT,
                        fontSize: 'clamp(18px, 2.5vw, 26px)',
                        fontWeight: 400,
                        fontFamily: 'inherit',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {activeTab === 'billede' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <label style={{ color: TEXT_DIM, fontSize: '16px', fontWeight: 600 }}>Indsæt billede af opskriften</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        width: '100%',
                        border: `2px dashed ${imageData ? ACCENT : 'rgba(26, 225, 122, 0.40)'}`,
                        borderRadius: '10px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(26, 225, 122, 0.04)',
                        transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = imageData ? ACCENT : 'rgba(26, 225, 122, 0.40)' }}
                    >
                      {imageData ? (
                        <>
                          <p style={{ color: ACCENT, fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>{imageName}</p>
                          <p style={{ color: TEXT_MUTED, fontSize: '14px', margin: 0 }}>Klik for at vælge et andet billede</p>
                        </>
                      ) : (
                        <>
                          <p style={{ color: TEXT, fontSize: '20px', fontWeight: 600, margin: '0 0 6px' }}>Klik for at uploade et billede</p>
                          <p style={{ color: TEXT_MUTED, fontSize: '14px', margin: 0 }}>JPG, PNG eller HEIC</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                )}

                {activeTab === 'text' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <label style={{ color: TEXT_DIM, fontSize: '16px', fontWeight: 600 }}>Opskrift som tekst</label>
                    <textarea
                      placeholder={'Eksempel\n200g hvedemel\n2 æg\n3dl mælk\n\n1 bland mel og æg ...\n2 tilsæt mælken ...'}
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      rows={8}
                      style={{
                        width: '100%',
                        padding: '24px',
                        borderRadius: '10px',
                        border: `2px solid ${ACCENT}`,
                        backgroundColor: 'rgba(30, 30, 30, 0.10)',
                        color: TEXT_MUTED,
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        lineHeight: '28px',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.color = TEXT }}
                      onBlur={e => { if (!textInput) e.currentTarget.style.color = TEXT_MUTED }}
                    />
                  </div>
                )}
              </div>

              {/* Fejl */}
              {error && (
                <div style={{
                  width: '100%',
                  maxWidth: '720px',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(220,60,60,0.12)',
                  border: '1px solid rgba(220,60,60,0.25)',
                  color: '#ff8080',
                  fontSize: '15px',
                  lineHeight: '22px',
                }}>
                  {error}
                </div>
              )}

              {/* Submit-knap */}
              <button
                onClick={handleConvert}
                disabled={!isValid()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px 48px',
                  borderRadius: '81px',
                  border: 'none',
                  backgroundColor: isValid() ? '#EFEEE9' : 'rgba(239, 238, 233, 0.12)',
                  boxShadow: isValid() ? '0px 0px 19.7px rgba(87, 57, 6, 0.50)' : 'none',
                  color: isValid() ? '#000' : 'rgba(239,238,233,0.25)',
                  fontSize: '24px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: isValid() ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.15s ease, opacity 0.2s ease',
                }}
                onMouseEnter={e => { if (isValid()) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                onMouseDown={e => { if (isValid()) e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Lav opskriften til mig
                {isValid() && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9h10M10 4l5 5-5 5"/>
                  </svg>
                )}
              </button>

            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
