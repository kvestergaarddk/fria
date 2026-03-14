import { Link } from 'react-router-dom'
import Logo from './Logo'

const BG_DARK = '#004F26'
const TEXT = '#EFEEE9'

export default function Footer({ light = false }) {
  if (light) {
    return (
      <footer style={{ backgroundColor: BG_DARK, padding: '64px 24px 32px', textAlign: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden" style={{ display: 'inline-block', marginBottom: '16px' }}>
          <Logo height={44} />
        </Link>
        <p style={{ color: TEXT, fontSize: '22px', fontWeight: 400, margin: '0 0 40px 0', opacity: 0.9 }}>
          Mad til glade maver
        </p>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '40px' }}>
          {[{ to: '/faq', label: 'FAQ' }, { to: '/om-mavro', label: 'Om Mavro' }, { to: '/kontakt', label: 'Kontakt' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ color: TEXT, fontSize: '16px', fontWeight: 400, textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p style={{ color: TEXT, fontSize: '12px', fontWeight: 400, margin: 0, opacity: 0.35 }}>
          Copyright Mavro 2025
        </p>
      </footer>
    )
  }

  return (
    <footer style={{ backgroundColor: BG_DARK, borderTop: '1px solid rgba(239, 238, 233, 0.10)' }} className="mt-20 px-6 md:px-20 pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link to="/" aria-label="Gå til forsiden">
            <Logo height={40} />
          </Link>
          <nav className="flex items-center gap-8">
            {[{ to: '/faq', label: 'FAQ' }, { to: '/om-mavro', label: 'Om Mavro' }, { to: '/kontakt', label: 'Kontakt' }].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{ color: TEXT, fontSize: '18px', fontWeight: 400, opacity: 0.7, textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p style={{ color: TEXT, fontSize: '12px', fontWeight: 400, margin: 0, opacity: 0.4 }}>
          Copyright Mavro 2025
        </p>
      </div>
    </footer>
  )
}
