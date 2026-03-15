import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'
import Logo from './Logo'
import Footer from './Footer'
import ConverterResult from './ConverterResult'

const GREEN = '#204636'
const DARK = '#1B3A28'
const CREAM = '#BFCEA3'

const INPUT_TABS = [
  { id: 'url', label: 'Link' },
  { id: 'text', label: 'Tekst' },
  { id: 'billede', label: 'Billede' },
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
      {/* Dancing star figure */}
      <div style={{ marginBottom: '36px' }}>
        <img
          src="/images/Mavro_figur_dancing.svg"
          alt="Mavro danser"
          style={{
            width: '140px',
            height: 'auto',
            animation: 'dance 1.6s ease-in-out infinite',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      <h2
        style={{
          color: DARK,
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 800,
          letterSpacing: 0,
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
        @keyframes dance {
          0%   { transform: translateY(0px) rotate(0deg); }
          15%  { transform: translateY(-14px) rotate(-8deg); }
          30%  { transform: translateY(-8px) rotate(7deg); }
          50%  { transform: translateY(-16px) rotate(-6deg); }
          70%  { transform: translateY(-6px) rotate(9deg); }
          85%  { transform: translateY(-12px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.8; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

export default function ConverterPage() {
  const posthog = usePostHog()
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
    posthog?.capture('konvertering_startet', { metode: activeTab, intolerance })
    setError(null)
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      posthog?.capture('konvertering_gennemfoert', { metode: activeTab, intolerance })
      setResult(data.result)
    } catch (err) {
      posthog?.capture('konvertering_fejlet', { metode: activeTab, intolerance })
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

  const activeIdx = INPUT_TABS.findIndex(t => t.id === activeTab)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CREAM }}>

      <header className="pt-20 pb-0 flex flex-col items-center text-center px-4 md:px-8">
        <Link to="/" aria-label="Gå til forsiden"><Logo color={GREEN} /></Link>
        <h1
          className="mt-20 w-full"
          style={{
            color: GREEN,
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 100px)',
            lineHeight: 1,
            maxWidth: '1220px',
          }}
        >
          Konverter en opskrift
        </h1>
      </header>

      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8 pt-10">

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <p style={{ color: GREEN, fontSize: '20px', fontWeight: 400, lineHeight: '28px', margin: '0 0 48px 0', maxWidth: '600px' }}>
              Indsæt et link, skriv en opskrift eller upload et billede — og få den konverteret med præcise ingredienserstatninger.
            </p>

            {/* Formular */}
            <div style={{ marginBottom: '64px' }}>

              {/* Animated pill tabs */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  backgroundColor: '#A5B98C',
                  borderRadius: '100px',
                  padding: '5px',
                  marginBottom: '40px',
                  maxWidth: '400px',
                }}
              >
                {/* Sliding pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    bottom: '5px',
                    width: `calc((100% - 10px) / ${INPUT_TABS.length})`,
                    borderRadius: '100px',
                    backgroundColor: GREEN,
                    transform: `translateX(calc(${activeIdx} * 100%))`,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                  }}
                />
                {INPUT_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setError(null) }}
                    style={{
                      flex: 1,
                      position: 'relative',
                      zIndex: 1,
                      padding: '12px 16px',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '17px',
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      backgroundColor: 'transparent',
                      color: activeTab === tab.id ? CREAM : GREEN,
                      transition: 'color 0.2s ease',
                    }}
                  >
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
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
