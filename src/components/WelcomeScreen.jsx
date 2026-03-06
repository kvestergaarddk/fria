import { useNavigate } from 'react-router-dom'

const options = [
  {
    key: 'gluten',
    intolerances: 'gluten',
    title: 'Glutenintolerans',
    description: 'Opskrifter uden gluten — frit for hvede, rug og byg.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 4.5-2.5 7.5-5 9.5" />
        <path d="M12 2a9 9 0 0 0-9 9c0 4.5 2.5 7.5 5 9.5" />
        <path d="M12 2v20" />
        <path d="M9 6c1 1 2 2 3 4" />
        <path d="M15 6c-1 1-2 2-3 4" />
        <path d="M9 12c1 1 2 1.5 3 3" />
        <path d="M15 12c-1 1-2 1.5-3 3" />
      </svg>
    ),
  },
  {
    key: 'laktose',
    intolerances: 'dairy',
    title: 'Laktoseintolerans',
    description: 'Opskrifter uden laktose — ingen mælk, fløde eller ost.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l2 5H6L8 2z" />
        <path d="M6 7c0 0-2 2-2 7a8 8 0 0 0 16 0c0-5-2-7-2-7" />
        <path d="M10 14a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  {
    key: 'begge',
    intolerances: 'gluten,dairy',
    title: 'Begge',
    description: 'Opskrifter fri for både gluten og laktose.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="12" r="5" />
        <circle cx="15" cy="12" r="5" />
        <path d="M12 9v6" />
      </svg>
    ),
  },
]

export default function WelcomeScreen() {
  const navigate = useNavigate()

  const handleSelect = (option) => {
    localStorage.setItem('fria_intolerances', option.intolerances)
    localStorage.setItem('fria_intolerances_key', option.key)
    localStorage.setItem('fria_intolerances_label', option.title)
    navigate('/opskrifter')
  }

  return (
    <div className="grain min-h-screen bg-cream-100 relative overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      {/* Baggrundsgradients */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(92,122,90,0.18) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      {/* Logo og tagline */}
      <div className="relative z-10 text-center mb-16">
        <h1
          className="font-serif text-8xl text-sage-700 select-none"
          style={{ letterSpacing: '-0.04em' }}
        >
          Fria
        </h1>
        <p className="font-sans text-sage-500 mt-3 text-base tracking-widest uppercase">
          Mad du kan tåle
        </p>
      </div>

      {/* Valg-kort */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSelect(option)}
            className="group bg-white rounded-2xl p-8 text-left shadow-sage
                       transition-transform duration-300 ease-out
                       hover:-translate-y-1 hover:shadow-sage-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100
                       active:translate-y-0 active:shadow-sage"
          >
            <div
              className="w-11 h-11 rounded-xl bg-sage-50 flex items-center justify-center mb-5 text-sage-500
                          transition-colors duration-200 group-hover:bg-sage-100"
            >
              {option.icon}
            </div>
            <h2 className="font-serif text-xl text-forest mb-2">{option.title}</h2>
            <p className="text-sage-500 text-sm leading-relaxed">{option.description}</p>
            <div className="mt-6 flex items-center gap-2 text-sage-500 text-sm font-medium
                            transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <span>Vælg</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Bundtekst */}
      <p className="relative z-10 mt-12 text-cream-400 text-xs text-center">
        Klik på din intolerans for at se tilpassede opskrifter
      </p>
    </div>
  )
}
