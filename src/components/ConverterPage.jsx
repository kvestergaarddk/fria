import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import ConverterResult from './ConverterResult'

const GREEN = '#315E4A'
const DARK = '#1B3A28'
const CREAM = '#EEDDB6'

const INPUT_TABS = [
  {
    id: 'url', label: 'Link', icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10a3.75 3.75 0 005.303 0l2.121-2.121a3.75 3.75 0 00-5.303-5.304l-1.06 1.06"/>
        <path d="M10 7a3.75 3.75 0 00-5.303 0L2.576 9.121a3.75 3.75 0 005.303 5.304l1.06-1.06"/>
      </svg>
    ),
  },
  {
    id: 'text', label: 'Tekst', icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M2 4h13M2 8.5h8M2 13h10"/>
      </svg>
    ),
  },
  {
    id: 'billede', label: 'Billede', icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="2.5" width="14" height="12" rx="2"/>
        <circle cx="5.5" cy="6.5" r="1.5"/>
        <path d="M1.5 12l4-4 3.5 3.5 2-2 4.5 4.5"/>
      </svg>
    ),
  },
]

const INTOLERANCE_OPTIONS = [
  { id: 'gluten', label: 'Glutenfri' },
  { id: 'laktose', label: 'Laktosefri' },
  { id: 'begge', label: 'Glutenfri & laktosefri' },
]

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
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  })

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      {/* Spinner */}
      <div style={{ position: 'relative', width: '72px', height: '72px', marginBottom: '36px' }}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          style={{ animation: 'spin 1.2s linear infinite', position: 'absolute', inset: 0 }}
        >
          <circle cx="36" cy="36" r="30" stroke={`rgba(49,94,74,0.12)`} strokeWidth="4"/>
          <path
            d="M36 6 A30 30 0 0 1 66 36"
            stroke={GREEN}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14h16M14 6l8 8-8 8" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <h2
        style={{
          color: DARK,
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          margin: '0 0 16px 0',
        }}
      >
        Konverterer opskriften
      </h2>

      <p
        key={msgIdx}
        style={{
          color: GREEN,
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: '28px',
          margin: '0 0 32px 0',
          opacity: 0.8,
          animation: 'fadeIn 0.4s ease',
        }}
      >
        {LOADING_MESSAGES[msgIdx]}
      </p>

      <p style={{ color: GREEN, fontSize: '14px', opacity: 0.5, margin: 0 }}>
        Det tager typisk 15–30 sekunder
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.8; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

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
    reader.onload = ev => setImageData(ev.target.result)
    reader.readAsDataURL(file)
  }

  function getContent() {
    if (activeTab === 'url') return urlInput.trim()
    if (activeTab === 'text') return textInput.trim()
    return imageData
  }

  function isValid() {
    if (activeTab === 'url') return urlInput.trim().startsWith('http')
    if (activeTab === 'text') return textInput.trim().length > 20
    return !!imageData
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

  if (result) {
    return <ConverterResult result={result} intolerance={intolerance} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CREAM }}>

      {/* Header — identisk med RecipeDetail */}
      <header className="pt-10 pb-4 flex flex-col items-center px-4">
        <Link to="/" aria-label="Gå til forsiden"><Logo color={GREEN} /></Link>
      </header>

      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8">

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Overskrift */}
            <div style={{ marginBottom: '48px', paddingTop: '24px' }}>
              <h1
                style={{
                  color: DARK,
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  margin: '0 0 16px 0',
                }}
              >
                Konverter en opskrift
              </h1>
              <p style={{ color: GREEN, fontSize: '20px', fontWeight: 400, lineHeight: '28px', margin: 0, maxWidth: '600px' }}>
                Indsæt et link, skriv en opskrift eller upload et billede — og få den konverteret med præcise ingredienserstatninger.
              </p>
            </div>

            {/* Formkort */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '32px',
                padding: 'clamp(24px, 4vw, 48px)',
                boxShadow: '0 4px 32px rgba(27,58,40,0.07), 0 1px 4px rgba(27,58,40,0.04)',
                marginBottom: '64px',
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
                  marginBottom: '32px',
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
                      padding: '11px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                      color: activeTab === tab.id ? DARK : 'rgba(49,94,74,0.45)',
                      boxShadow: activeTab === tab.id ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                      transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ marginBottom: '32px' }}>
                {activeTab === 'url' && (
                  <div>
                    <label style={{ display: 'block', color: DARK, fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
                      Link til opskrift
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.valdemarsro.dk/..."
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `2px solid rgba(49,94,74,0.15)`,
                        backgroundColor: 'rgba(49,94,74,0.02)',
                        color: DARK,
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = GREEN }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(49,94,74,0.15)' }}
                    />
                    <p style={{ color: GREEN, fontSize: '14px', lineHeight: '20px', margin: '8px 0 0 0', opacity: 0.65 }}>
                      Indsæt et direkte link fra fx Valdemarsro, Mad.dk, Arla eller en udenlandsk opskriftsside.
                    </p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label style={{ display: 'block', color: DARK, fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
                      Opskrift som tekst
                    </label>
                    <textarea
                      placeholder={'Indsæt eller skriv opskriften her...\n\nEksempel:\n200g hvedemel\n2 æg\n3 dl mælk\n\n1. Bland mel og æg...\n2. Tilsæt mælken...'}
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      rows={10}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `2px solid rgba(49,94,74,0.15)`,
                        backgroundColor: 'rgba(49,94,74,0.02)',
                        color: DARK,
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        lineHeight: '28px',
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
                    <label style={{ display: 'block', color: DARK, fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
                      Billede af opskrift
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        border: `2px dashed ${imageData ? GREEN : 'rgba(49,94,74,0.2)'}`,
                        borderRadius: '14px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: imageData ? 'rgba(49,94,74,0.03)' : 'transparent',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      }}
                      onMouseEnter={e => { if (!imageData) e.currentTarget.style.borderColor = GREEN }}
                      onMouseLeave={e => { if (!imageData) e.currentTarget.style.borderColor = 'rgba(49,94,74,0.2)' }}
                    >
                      {imageData ? (
                        <>
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✓</div>
                          <p style={{ color: GREEN, fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>{imageName}</p>
                          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Klik for at vælge et andet billede</p>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
                          <p style={{ color: DARK, fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>Klik for at uploade et billede</p>
                          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>JPG, PNG eller HEIC — fx fra en kogebog eller et håndskrevet kort</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                )}
              </div>

              {/* Intoleransvælger */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', color: DARK, fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                  Hvad skal undgås?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {INTOLERANCE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setIntolerance(opt.id)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '100px',
                        border: `2px solid ${intolerance === opt.id ? GREEN : 'rgba(49,94,74,0.2)'}`,
                        backgroundColor: intolerance === opt.id ? GREEN : 'transparent',
                        color: intolerance === opt.id ? CREAM : GREEN,
                        fontSize: '15px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fejl */}
              {error && (
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(180,40,40,0.06)',
                    border: '1px solid rgba(180,40,40,0.18)',
                    color: '#a02020',
                    fontSize: '15px',
                    lineHeight: '22px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Konverter-knap */}
              <button
                onClick={handleConvert}
                disabled={!isValid()}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: isValid() ? GREEN : 'rgba(49,94,74,0.15)',
                  color: isValid() ? CREAM : 'rgba(49,94,74,0.35)',
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: isValid() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => { if (isValid()) e.currentTarget.style.backgroundColor = DARK }}
                onMouseLeave={e => { if (isValid()) e.currentTarget.style.backgroundColor = GREEN }}
              >
                Konverter opskrift
              </button>
            </div>

            {/* Info-sektion */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
                marginBottom: '80px',
              }}
            >
              {[
                { emoji: '🔗', title: 'Indsæt link', text: 'Kopier et link fra din yndlingsopskriftsside og indsæt det direkte.' },
                { emoji: '✍️', title: 'Skriv eller paste', text: 'Skriv en opskrift direkte eller kopier den fra et dokument.' },
                { emoji: '📷', title: 'Tag et billede', text: 'Fotografer en side fra en kogebog eller et håndskrevet opskriftskort.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '28px',
                    borderRadius: '24px',
                    backgroundColor: 'rgba(49,94,74,0.05)',
                    border: '1px solid rgba(49,94,74,0.08)',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.emoji}</div>
                  <h3 style={{ color: DARK, fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ color: GREEN, fontSize: '16px', lineHeight: '24px', margin: 0, opacity: 0.8 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
