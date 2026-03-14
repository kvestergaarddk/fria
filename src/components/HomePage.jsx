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

function GlutenIcon({ active }) {
  const c = '#000'
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M32.4713 10.3724L27.9232 13.3333C27.7511 12.2527 27.3973 11.2093 26.8756 10.2636L24 5.05615L21.1245 10.2636C20.6027 11.2079 20.249 12.2513 20.0769 13.3333L15.5288 10.3724V16.33C15.5288 17.0155 15.6348 17.6845 15.8344 18.3191L15.5288 18.1209V24.0786C15.5288 24.7641 15.6348 25.4331 15.8344 26.0677L15.5288 25.8695V31.8271C15.5288 34.0681 16.6507 36.1371 18.5283 37.3594L23.2498 40.4333V47.1783H24.7503V40.4333L29.4718 37.3594C31.3508 36.1371 32.4713 34.0681 32.4713 31.8271V25.8695L32.1657 26.0677C32.3653 25.4331 32.4713 24.7641 32.4713 24.0786V18.1209L32.1657 18.3191C32.3653 17.6845 32.4713 17.0155 32.4713 16.33V10.3724ZM24.7503 23.1453V19.9531C24.7503 18.2214 25.6175 16.6232 27.0684 15.6775L30.9722 13.1364V16.3286C30.9722 18.0603 30.105 19.6585 28.6541 20.6042L24.7503 23.1453ZM22.4363 10.989L23.9987 8.15888L25.561 10.989C26.1075 11.9774 26.4338 13.0965 26.5177 14.2459L26.2479 14.4208C25.2788 15.0512 24.5135 15.9074 23.9973 16.8958C23.4811 15.9074 22.7157 15.0512 21.7466 14.4208L21.4768 14.2459C21.5608 13.0952 21.8871 11.9774 22.4335 10.989H22.4363ZM17.0279 13.1378L20.9317 15.6789C22.384 16.6232 23.2498 18.2214 23.2498 19.9545V23.1467L19.346 20.6056C17.8937 19.6613 17.0279 18.0631 17.0279 16.33V13.1378ZM17.0279 24.0786V20.8864L20.9317 23.4275C22.384 24.3718 23.2498 25.9699 23.2498 27.703V30.8952L21.7508 29.9192C21.7508 29.9192 21.7508 29.9192 21.7494 29.9192L19.346 28.3541C17.8951 27.4098 17.0279 25.8116 17.0279 24.08V24.0786ZM17.0279 31.8271V28.6349L18.5269 29.6109L20.9317 31.176C22.3826 32.1203 23.2485 33.7185 23.2485 35.4502V38.6424L19.3446 36.1013C17.8923 35.157 17.0265 33.5588 17.0265 31.8258L17.0279 31.8271ZM30.9722 31.8271C30.9722 33.5588 30.105 35.157 28.6541 36.1027L24.7503 38.6438V35.4516C24.7503 33.7199 25.6161 32.1217 27.067 31.1774L29.4718 29.6123L30.9722 28.6363V31.8285V31.8271ZM26.2507 29.9179L24.7503 30.8938V27.7016C24.7503 25.9699 25.6175 24.3718 27.0684 23.4261L30.9722 20.885V24.0772C30.9722 25.8089 30.105 27.4071 28.6541 28.3527L27.2129 29.2902L26.2493 29.9165L26.2507 29.9179Z" fill={c}/>
      <path d="M33.3716 15.6885L41.2895 7.77201L40.2281 6.71069L33.3716 13.5672V15.6885Z" fill={c}/>
      <path d="M14.6421 32.2964L6.71045 40.228L7.77176 41.2893L14.9752 34.0859C14.7949 33.5119 14.6806 32.9117 14.6435 32.2964H14.6421Z" fill={c}/>
      <path d="M24 48C10.7659 48 0 37.2341 0 24C0 10.7659 10.7659 0 24 0C37.2341 0 48 10.7659 48 24C48 37.2341 37.2341 48 24 48ZM24 1.50043C11.5932 1.50043 1.50043 11.5932 1.50043 24C1.50043 36.4068 11.5932 46.4996 24 46.4996C36.4068 46.4996 46.4996 36.4068 46.4996 24C46.4996 11.5932 36.4068 1.50043 24 1.50043Z" fill={c}/>
    </svg>
  )
}

function LaktoseIcon({ active }) {
  const c = '#000'
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M12.4534 34.4851L6.71045 40.228L7.77176 41.288L13.0508 36.0089C12.8195 35.5175 12.6186 35.0096 12.4534 34.4851Z" fill={c}/>
      <path d="M23.9999 42.0712C17.8261 42.0712 12.8018 37.0482 12.8018 30.8731C12.8018 21.4176 22.9538 6.86206 23.386 6.24675L23.9999 5.37402L24.6139 6.24675C25.0461 6.86206 35.1981 21.4176 35.1981 30.8731C35.1981 37.0469 30.1751 42.0712 23.9999 42.0712ZM23.9999 8.01698C21.7796 11.3592 14.3022 23.1878 14.3022 30.8745C14.3022 36.2223 18.6521 40.5722 23.9999 40.5722C29.3478 40.5722 33.6977 36.2223 33.6977 30.8745C33.6977 23.1878 26.2203 11.3606 23.9999 8.01698Z" fill={c}/>
      <path d="M29.8255 31.5627C29.5103 34.2401 27.3863 36.3709 24.7117 36.6958C24.3703 36.7371 24.0853 37 24.0413 37.3414C23.9766 37.8397 24.3964 38.2444 24.8768 38.188C28.2521 37.786 30.935 35.0921 31.3191 31.71C31.3686 31.2695 31.0148 30.8882 30.5716 30.8882C30.1862 30.8882 29.8709 31.1814 29.8255 31.5641V31.5627Z" fill={c}/>
      <path d="M31.9951 17.0663L41.2895 7.77185L40.2282 6.71191L31.2876 15.6525C31.5257 16.1164 31.7625 16.5872 31.9951 17.0663Z" fill={c}/>
      <path d="M24 48C10.7659 48 0 37.2341 0 24C0 10.7659 10.7659 0 24 0C37.2341 0 48 10.7659 48 24C48 37.2341 37.2341 48 24 48ZM24 1.50043C11.5932 1.50043 1.50043 11.5932 1.50043 24C1.50043 36.4068 11.5932 46.4996 24 46.4996C36.4068 46.4996 46.4996 36.4054 46.4996 24C46.4996 11.5946 36.4068 1.50043 24 1.50043Z" fill={c}/>
    </svg>
  )
}

function LinkIcon({ active }) {
  const c = '#000'
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6.09551 8.08909C6.38181 8.47184 6.74708 8.78854 7.16654 9.01771C7.58601 9.24689 8.04985 9.38317 8.52661 9.41731C9.00337 9.45146 9.4819 9.38267 9.92974 9.21561C10.3776 9.04855 10.7843 8.78713 11.1222 8.44909L13.1222 6.44909C13.7294 5.82041 14.0654 4.97841 14.0578 4.10442C14.0502 3.23043 13.6996 2.39439 13.0816 1.77636C12.4635 1.15833 11.6275 0.80777 10.7535 0.800175C9.87952 0.79258 9.03752 1.12856 8.40884 1.73575L7.26218 2.87575M8.76218 6.75575C8.47588 6.373 8.11061 6.0563 7.69114 5.82713C7.27168 5.59796 6.80784 5.46168 6.33108 5.42753C5.85431 5.39339 5.37579 5.46218 4.92795 5.62923C4.48011 5.79629 4.07343 6.05771 3.73551 6.39575L1.73551 8.39575C1.12832 9.02443 0.792336 9.86644 0.799931 10.7404C0.807525 11.6144 1.15809 12.4505 1.77612 13.0685C2.39414 13.6865 3.23018 14.0371 4.10417 14.0447C4.97816 14.0523 5.82017 13.7163 6.44884 13.1091L7.58884 11.9691" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CameraIconSvg({ active }) {
  const c = '#000'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.3332 12.6667C15.3332 13.0203 15.1927 13.3594 14.9426 13.6095C14.6926 13.8595 14.3535 14 13.9998 14H1.99984C1.64622 14 1.30708 13.8595 1.05703 13.6095C0.80698 13.3594 0.666504 13.0203 0.666504 12.6667V5.33333C0.666504 4.97971 0.80698 4.64057 1.05703 4.39052C1.30708 4.14048 1.64622 4 1.99984 4H4.6665L5.99984 2H9.99984L11.3332 4H13.9998C14.3535 4 14.6926 4.14048 14.9426 4.39052C15.1927 4.64057 15.3332 4.97971 15.3332 5.33333V12.6667Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.99984 11.3333C9.4726 11.3333 10.6665 10.1394 10.6665 8.66667C10.6665 7.19391 9.4726 6 7.99984 6C6.52708 6 5.33317 7.19391 5.33317 8.66667C5.33317 10.1394 6.52708 11.3333 7.99984 11.3333Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FileTextIcon({ active }) {
  const c = '#000'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.33317 1.33325H3.99984C3.64622 1.33325 3.30708 1.47373 3.05703 1.72378C2.80698 1.97382 2.6665 2.31296 2.6665 2.66659V13.3333C2.6665 13.6869 2.80698 14.026 3.05703 14.2761C3.30708 14.5261 3.64622 14.6666 3.99984 14.6666H11.9998C12.3535 14.6666 12.6926 14.5261 12.9426 14.2761C13.1927 14.026 13.3332 13.6869 13.3332 13.3333V5.33325M9.33317 1.33325L13.3332 5.33325M9.33317 1.33325L9.33317 5.33325H13.3332M10.6665 8.66658H5.33317M10.6665 11.3333H5.33317M6.6665 5.99992H5.33317" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? ACCENT : INACTIVE_BG,
    boxShadow: '0 0 19.7px 0 rgba(0, 0, 0, 0.55)',
    color: '#000',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.15s ease',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  })

  const tabStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? ACCENT : INACTIVE_BG,
    boxShadow: '0 0 19.7px 0 rgba(0, 0, 0, 0.55)',
    color: '#000',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.15s ease',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>

      <style>{`
        .mavro-header { padding: 32px 80px; }
        .mavro-main { padding: 48px 40px 120px; }
        .mavro-info { padding: 120px 250px; }
        @media (max-width: 768px) {
          .mavro-header { padding: 20px 16px; }
          .mavro-main { padding: 32px 16px 80px; }
          .mavro-info { padding: 60px 16px; }
        }
      `}</style>

      {/* Header */}
      <header className="mavro-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo height={79} />
      </header>

      <main className="mavro-main" style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {loading ? <LoadingScreen /> : (
          <>
            {/* Hero */}
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <h1 style={{
                color: TEXT,
                fontSize: 'clamp(40px, 7vw, 100px)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                margin: '0 0 40px 0',
              }}>
                Gør enhver opskrift gluten og laktosefri
              </h1>
              <p style={{
                color: TEXT,
                fontSize: 'clamp(16px, 2.2vw, 30px)',
                fontWeight: 700,
                lineHeight: 1.35,
                margin: '0 auto',
                maxWidth: '900px',
              }}>
                Upload en opskrift, indsæt et link eller tag et billede. Mavro omskriver ingredienser og fremgangsmåde, så opskriften bliver fri for gluten og laktose.
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

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
                    <GlutenIcon active={glutenfri} />
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
                    <LaktoseIcon active={laktosefri} />
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
              <div style={{ width: '100%', maxWidth: '720px', display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
                {[
                  { id: 'url', label: 'Indsæt link', Icon: LinkIcon },
                  { id: 'billede', label: 'Upload billede', Icon: CameraIconSvg },
                  { id: 'text', label: 'Indsæt tekst', Icon: FileTextIcon },
                ].map(({ id, label, Icon }) => (
                  <button key={id} style={tabStyle(activeTab === id)} onClick={() => { setActiveTab(id); setError(null) }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: activeTab === id ? '#fff' : 'rgba(26,225,122,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon active={activeTab === id} />
                    </div>
                    {label}
                  </button>
                ))}
              </div>

              {/* Input-felt */}
              <div style={{ width: '100%', maxWidth: '960px', marginTop: '36px' }}>
                {activeTab === 'url' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <label style={{ color: TEXT_DIM, fontSize: '16px', fontWeight: 600 }}>Link til opskrift</label>
                    <input
                      type="url"
                      placeholder="fx.www.mormorsbedsteopskrift.dk"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="url-input"
                      style={{
                        width: '100%',
                        padding: '16px 0',
                        border: 'none',
                        borderBottom: '2px solid #1AE17A',
                        backgroundColor: 'rgba(30, 30, 30, 0.10)',
                        color: '#fff',
                        fontSize: '40px',
                        fontWeight: 600,
                        fontFamily: '"Rethink Sans"',
                        fontStyle: 'normal',
                        lineHeight: 'normal',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <style>{`.url-input::placeholder { color: rgba(255, 255, 255, 0.50); }`}</style>
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '24px 48px',
                  borderRadius: '81px',
                  border: 'none',
                  marginTop: '24px',
                  backgroundColor: isValid() ? '#EFEEE9' : 'rgba(239, 238, 233, 0.12)',
                  boxShadow: isValid() ? '0 0 19.7px 0 rgba(87, 57, 6, 0.50)' : 'none',
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

      {/* Info-modul — hvid sektion */}
      <div className="mavro-info" style={{
        background: '#FFF',
        boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <img src="/images/Mavro_figur_01.svg" alt="Mavro figur" style={{ width: '160px', height: 'auto' }} />
          <p style={{
            color: '#000',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '1.7',
            margin: 0,
          }}>
            Har du fundet en opskrift du gerne vil lave men som indeholder gluten eller laktose?
            Mavro analyserer opskriften og omskriver den med ingredienser der fungerer uden gluten og laktose.
            Samtidig justerer vi fremgangsmåden, så resultatet stadig smager godt og hænger sammen.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
