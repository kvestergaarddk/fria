import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'

const NAV_LINKS = [
  { to: '/', label: 'Forside' },
  { to: '/gemte-opskrifter', label: 'Gemte opskrifter' },
  { to: '/faq', label: 'FAQ' },
  { to: '/om-mavro', label: 'Om Mavro' },
  { to: '/kontakt', label: 'Kontakt' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Pill Menu-knap — fast øverst til højre */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Luk menu' : 'Åbn menu'}
        style={{
          position: 'fixed',
          top: '28px',
          right: '40px',
          zIndex: 60,
          height: '48px',
          padding: '0 24px',
          backgroundColor: '#1AE17A',
          boxShadow: '0px 0px 19.7px rgba(0, 79, 38, 0.35)',
          borderRadius: '81px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'opacity 0.2s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l10 10M3 13L13 3"/>
          </svg>
        ) : (
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
            <path d="M1 2h16M1 6h16M1 10h16"/>
          </svg>
        )}
        <span style={{ color: '#000', fontSize: '20px', fontWeight: 700, fontFamily: 'inherit', lineHeight: 1 }}>
          Menu
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer fra højre */}
      <nav
        aria-hidden={!open}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: 'min(400px, 88vw)',
          backgroundColor: BG,
          borderLeft: `1px solid rgba(26, 225, 122, 0.15)`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 40px',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    lineHeight: 1.3,
                    display: 'inline-block',
                    padding: '10px 0',
                    color: isActive ? ACCENT : TEXT,
                    opacity: isActive ? 1 : 0.85,
                    transition: 'color 0.2s ease, opacity 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.color = isActive ? ACCENT : TEXT; e.currentTarget.style.opacity = isActive ? '1' : '0.85' }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: `1px solid rgba(239, 238, 233, 0.12)` }}>
          <a
            href="mailto:hej@mavro.dk"
            style={{ color: TEXT, fontSize: '16px', fontWeight: 400, textDecoration: 'none', opacity: 0.5 }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.5' }}
          >
            hej@mavro.dk
          </a>
        </div>
      </nav>
    </>
  )
}
