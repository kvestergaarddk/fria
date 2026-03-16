import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'
const INACTIVE_BG = 'rgba(26, 225, 122, 0.10)'
const INACTIVE_BORDER = 'rgba(26, 225, 122, 0.20)'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'confirm'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        onClose()
      } else {
        await signUp(email, password)
        setMode('confirm')
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  function translateError(msg) {
    if (msg.includes('Invalid login credentials')) return 'Forkert email eller adgangskode.'
    if (msg.includes('Email not confirmed')) return 'Bekræft din email før du logger ind.'
    if (msg.includes('User already registered')) return 'Der findes allerede en konto med denne email.'
    if (msg.includes('Password should be at least')) return 'Adgangskoden skal være mindst 6 tegn.'
    return 'Noget gik galt. Prøv igen.'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${INACTIVE_BORDER}`,
    backgroundColor: INACTIVE_BG,
    color: TEXT,
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: BG,
        borderRadius: '20px',
        border: `1px solid ${INACTIVE_BORDER}`,
        padding: '40px 36px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          aria-label="Luk"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: TEXT_DIM,
            cursor: 'pointer', padding: '4px', borderRadius: '6px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l12 12M15 3L3 15"/>
          </svg>
        </button>

        {mode === 'confirm' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: INACTIVE_BG, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" rx="2"/><path d="M4 8l8 5 8-5"/>
              </svg>
            </div>
            <h2 style={{ color: TEXT, fontSize: '20px', fontWeight: 700, margin: '0 0 10px' }}>Tjek din email</h2>
            <p style={{ color: TEXT_DIM, fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              Vi har sendt et bekræftelseslink til <strong style={{ color: TEXT }}>{email}</strong>. Klik på linket for at aktivere din konto.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 28px', borderRadius: '100px',
                backgroundColor: ACCENT, color: '#000',
                border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Forstået
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ color: TEXT, fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>
              {mode === 'login' ? 'Log ind' : 'Opret konto'}
            </h2>
            <p style={{ color: TEXT_DIM, fontSize: '14px', margin: '0 0 28px', lineHeight: 1.5 }}>
              {mode === 'login'
                ? 'Få adgang til dine gemte opskrifter på alle enheder.'
                : 'Gem dine opskrifter sikkert i skyen.'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Adgangskode"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />

              {error && (
                <p style={{ color: '#ff8080', fontSize: '13px', margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '13px', borderRadius: '100px',
                  backgroundColor: ACCENT, color: '#000',
                  border: 'none', fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginTop: '4px',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {loading ? '...' : mode === 'login' ? 'Log ind' : 'Opret konto'}
              </button>
            </form>

            <p style={{ color: TEXT_DIM, fontSize: '13px', textAlign: 'center', margin: '20px 0 0' }}>
              {mode === 'login' ? 'Har du ikke en konto? ' : 'Har du allerede en konto? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
                style={{
                  background: 'none', border: 'none', color: ACCENT,
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0,
                }}
              >
                {mode === 'login' ? 'Opret konto' : 'Log ind'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
