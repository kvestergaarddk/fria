import { useNavigate } from 'react-router-dom'

const labelMap = {
  gluten: 'Glutenfri',
  laktose: 'Laktosefri',
  begge: 'Gluten- & laktosefri',
}

export default function Navbar({ showBack = false }) {
  const navigate = useNavigate()
  const key = localStorage.getItem('fria_intolerances_key') || ''
  const label = labelMap[key] || ''

  return (
    <header className="sticky top-0 z-30 bg-cream-100/90 backdrop-blur-sm border-b border-cream-300">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Venstre: tilbage-knap eller logo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sage-500 text-sm font-medium
                         transition-opacity duration-200 hover:opacity-70
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 rounded-md px-1
                         active:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
              Tilbage
            </button>
          )}
        </div>

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="font-serif text-2xl text-sage-700 tracking-tighter
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 rounded
                     transition-opacity duration-200 hover:opacity-80 active:opacity-60"
          style={{ letterSpacing: 0 }}
        >
          Fria
        </button>

        {/* Højre: badge */}
        <div className="flex items-center">
          {label && (
            <span className="bg-sage-100 text-sage-700 text-xs font-medium px-3 py-1 rounded-full">
              {label}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
