import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const GREEN = '#315E4A'
const BG = '#EEDDB6'

const NAV_LINKS = [
  { to: '/', label: 'Forside' },
  { to: '/glutenfri', label: 'Glutenfri opskrifter' },
  { to: '/laktosefri', label: 'Laktosefri opskrifter' },
  { to: '/begge', label: 'Glutenfri & laktosefri' },
  { to: '/om-mavro', label: 'Om Mavro' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Luk ved navigation
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Lås scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Hamburger-knap — fast placeret øverst til højre */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Åbn menu"
        style={{
          position: 'fixed',
          top: '24px',
          right: '32px',
          zIndex: 60,
          backgroundColor: GREEN,
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l10 10M4 14L14 4"/>
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 2h16M1 7h16M1 12h16"/>
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
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
          width: 'min(360px, 85vw)',
          backgroundColor: GREEN,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 40px',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
        }}
      >
        {/* Links */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: '60px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  style={{
                    color: isActive ? '#EFBA5A' : BG,
                    fontSize: '28px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    lineHeight: 1.3,
                    display: 'block',
                    padding: '8px 0',
                    opacity: isActive ? 1 : 0.9,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#EFBA5A' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = BG }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Kontakt nederst */}
        <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: `1px solid rgba(238,221,182,0.2)` }}>
          <a
            href="mailto:hej@mavro.dk"
            style={{ color: BG, fontSize: '16px', fontWeight: 400, textDecoration: 'none', opacity: 0.7 }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
          >
            hej@mavro.dk
          </a>
        </div>
      </nav>
    </>
  )
}
