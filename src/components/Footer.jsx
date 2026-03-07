import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#003D1A' }} className="mt-16 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/">
          <Logo color="#ffffff" className="opacity-90 hover:opacity-100 transition-opacity" />
        </Link>
        <nav className="flex items-center gap-8">
          <a
            href="mailto:hej@mavro.dk"
            className="text-white/70 text-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
          >
            Kontakt
          </a>
          <Link
            to="/om-mavro"
            className="text-white/70 text-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
          >
            Om Mavro
          </Link>
        </nav>
      </div>
    </footer>
  )
}
