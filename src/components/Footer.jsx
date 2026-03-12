import { Link } from 'react-router-dom'
import Logo from './Logo'

const CREAM = '#BFCEA3'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#204636' }} className="mt-20 px-4 md:px-8 pt-[120px] pb-10">
      <div className="max-w-[1220px] mx-auto flex flex-col gap-[120px]">
        {/* Logo + nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link to="/" aria-label="Gå til forsiden">
            <Logo color={CREAM} />
          </Link>
          <nav className="flex items-center gap-8">
            <a
              href="/faq"
              style={{ color: CREAM, fontSize: '20px', fontWeight: 400 }}
              className="hover:opacity-70 transition-opacity duration-200"
            >
              FAQ
            </a>
            <Link
              to="/om-mavro"
              style={{ color: CREAM, fontSize: '20px', fontWeight: 400 }}
              className="hover:opacity-70 transition-opacity duration-200"
            >
              Om Mavro
            </Link>
            <a
              href="mailto:hej@mavro.dk"
              style={{ color: CREAM, fontSize: '20px', fontWeight: 400 }}
              className="hover:opacity-70 transition-opacity duration-200"
            >
              Kontakt
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <p style={{ color: CREAM, fontSize: '12px', fontWeight: 400, margin: 0 }}>
          Copyright Mavro 2025
        </p>
      </div>
    </footer>
  )
}
