import { Link } from 'react-router-dom'
import Logo from './Logo'

const BG_DARK = '#004F26'
const TEXT = '#EFEEE9'

export default function Footer({ light = false }) {
  const footerStyle = `
    .mavro-footer { padding: 120px 250px 40px; }
    @media (max-width: 768px) {
      .mavro-footer { padding: 60px 16px 40px; }
    }
  `
  if (light) {
    return (
      <footer className="mavro-footer" style={{ backgroundColor: BG_DARK, textAlign: 'center' }}>
        <style>{footerStyle}</style>
        <Link to="/" aria-label="Gå til forsiden" style={{ display: 'inline-block', marginBottom: '16px' }}>
          <img src="/images/Logo_Mavro_04_VERTIKAL.svg" alt="Mavro" height={80} />
        </Link>
        <p style={{ color: TEXT, fontSize: '22px', fontWeight: 400, margin: '0 0 40px 0', opacity: 0.9 }}>
          Mad til glade maver
        </p>
        <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 32px', marginBottom: '40px' }}>
          {[{ to: '/faq', label: 'FAQ' }, { to: '/om-mavro', label: 'Om Mavro' }, { to: '/kontakt', label: 'Kontakt' }, { to: '/privatlivspolitik', label: 'Privatlivspolitik' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ color: '#EFEEE9', fontFamily: '"Rethink Sans"', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: 'normal', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p style={{ color: TEXT, fontSize: '12px', fontWeight: 400, margin: 0, opacity: 0.35 }}>
          Copyright Mavro 2026
        </p>
      </footer>
    )
  }

  return (
    <footer className="mavro-footer" style={{ backgroundColor: BG_DARK, textAlign: 'center' }}>
      <style>{footerStyle}</style>
      <Link to="/" aria-label="Gå til forsiden" style={{ display: 'inline-block', marginBottom: '16px' }}>
        <img src="/images/Logo_Mavro_04_VERTIKAL.svg" alt="Mavro" height={80} />
      </Link>
      <p style={{ color: '#EFEEE9', fontFamily: '"Rethink Sans"', fontSize: '40px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', textAlign: 'center', margin: '0 0 40px 0' }}>
        Mad til glade maver
      </p>
      <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 32px', marginBottom: '40px' }}>
        {[{ to: '/faq', label: 'FAQ' }, { to: '/om-mavro', label: 'Om Mavro' }, { to: '/kontakt', label: 'Kontakt' }, { to: '/privatlivspolitik', label: 'Privatlivspolitik' }].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{ color: '#EFEEE9', fontFamily: '"Rethink Sans"', fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: 'normal', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p style={{ color: TEXT, fontSize: '12px', fontWeight: 400, margin: 0, opacity: 0.35 }}>
        Copyright Mavro 2026
      </p>
    </footer>
  )
}
