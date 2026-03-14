import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'
const INACTIVE_BG = 'rgba(26, 225, 122, 0.10)'
const INACTIVE_BORDER = 'rgba(26, 225, 122, 0.20)'

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>
      <style>{`.mavro-header-sub { padding: 32px 80px; } @media (max-width: 768px) { .mavro-header-sub { padding: 20px 16px; } }`}</style>

      <header className="mavro-header-sub" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden"><Logo height={79} /></Link>
      </header>

      <main className="flex-1 max-w-[760px] mx-auto w-full px-6 md:px-10 pb-20">

        <h1 style={{
          color: TEXT,
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 7vw, 80px)',
          lineHeight: 1,
          marginTop: '60px',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          Kontakt
        </h1>
        <p style={{ color: TEXT_DIM, fontSize: '20px', lineHeight: '32px', marginBottom: '48px' }}>
          Har du spørgsmål, feedback eller forslag? Vi hører gerne fra dig.
        </p>

        {/* Email */}
        <a
          href="mailto:hej@mavro.dk"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '20px 32px',
            borderRadius: '12px',
            border: `1.5px solid ${INACTIVE_BORDER}`,
            backgroundColor: INACTIVE_BG,
            textDecoration: 'none',
            marginBottom: '48px',
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.backgroundColor = 'rgba(26, 225, 122, 0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = INACTIVE_BORDER; e.currentTarget.style.backgroundColor = INACTIVE_BG }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
          <span style={{ color: TEXT, fontSize: '20px', fontWeight: 600 }}>hej@mavro.dk</span>
        </a>

        <p style={{ color: TEXT_DIM, fontSize: '16px', lineHeight: '24px' }}>
          Vi bestræber os på at svare inden for 1–2 hverdage.
        </p>

      </main>

      <Footer />
    </div>
  )
}
