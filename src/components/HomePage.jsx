import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import RecipeCard from './RecipeCard'
import { loadAllRecipes } from '../api/recipes'

const BG = '#BFCEA3'
const GREEN = '#204636'
const DARK = '#1B3A28'

export default function HomePage() {
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllRecipes()
      .then(setAllRecipes)
      .finally(() => setLoading(false))
  }, [])

  const quick = allRecipes.filter(r => r.readyInMinutes && r.readyInMinutes <= 30)
  const glutenQuick = quick.slice(0, 8)
  const laktoseQuick = quick.length > 8 ? quick.slice(8, 16) : quick.slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      {/* Header */}
      <header className="pt-20 pb-0 text-center">
        <div className="w-full max-w-[1220px] mx-auto px-4 md:px-8 flex flex-col items-center">
          <Link to="/" aria-label="Gå til forsiden">
            <Logo color={GREEN} />
          </Link>

          <h1
            className="mt-20 w-full"
            style={{
              color: GREEN,
              fontWeight: 800,
              fontSize: 'clamp(3rem, 7vw, 100px)',
              lineHeight: 1,
            }}
          >
            Lav lækre retter alle kan spise, helt uden gluten og laktose.
          </h1>

          <p className="mt-4 w-full" style={{ color: GREEN, fontSize: 'clamp(1.1rem, 2.5vw, 30px)', fontWeight: 700, lineHeight: 'clamp(1.4, 3vw, 38px)' }}>
            Gå på opdagelse i flere hundrede lækre opskrifter,{' '}
            <Link to="/glutenfri" className="group relative inline-block hover:text-[#EFBA5A]" style={{ color: GREEN, textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s ease' }}>
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#EFBA5A] after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">uden gluten</span>
            </Link>
            ,{' '}
            <Link to="/laktosefri" className="group relative inline-block hover:text-[#EFBA5A]" style={{ color: GREEN, textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s ease' }}>
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#EFBA5A] after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">laktose</span>
            </Link>
            {' '}eller{' '}
            <Link to="/begge" className="group relative inline-block hover:text-[#EFBA5A]" style={{ color: GREEN, textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s ease' }}>
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#EFBA5A] after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">begge dele</span>
            </Link>
            .
          </p>
        </div>
      </header>

      {/* Hero-billede */}
      <div className="w-full px-4 md:px-8 mt-20 mb-20">
        <div className="overflow-hidden" style={{ aspectRatio: '16/7', borderRadius: '40px' }}>
          <img
            src="/forside-billede.jpg"
            alt="Mad på bordet"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Konverter-banner */}
      <div className="w-full px-4 md:px-8 mb-20">
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            borderRadius: '32px',
            backgroundColor: '#204636',
            padding: 'clamp(32px, 5vw, 56px) clamp(28px, 5vw, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '220px' }}>
            <p style={{ color: 'rgba(191,206,163,0.6)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
              Ny funktion
            </p>
            <h2 style={{ color: '#BFCEA3', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 10px 0' }}>
              Konverter din yndlingsopskrift
            </h2>
            <p style={{ color: 'rgba(191,206,163,0.75)', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
              Indsæt et link, en tekst eller et billede — og få opskriften tilpasset med præcise erstatninger.
            </p>
          </div>
          <Link
            to="/konverter"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              borderRadius: '100px',
              backgroundColor: '#EFBA5A',
              color: '#1B3A28',
              fontSize: '15px',
              fontWeight: 800,
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'background-color 0.2s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5ca7a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#EFBA5A'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Prøv konverteren
          </Link>
        </div>
      </div>

      {/* Opskriftsektioner */}
      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8 pb-4">

        <RecipeSection
          title="Glutenfrie retter på under 30 min."
          linkTo="/glutenfri"
          recipes={glutenQuick}
          loading={loading}
        />

        <div className="mt-20">
          <RecipeSection
            title="Laktosefri retter på under 30 min."
            linkTo="/laktosefri"
            recipes={laktoseQuick}
            loading={loading}
          />
        </div>

      </main>

      <Footer />
    </div>
  )
}

function RecipeSection({ title, linkTo, recipes, loading }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2
          style={{ color: DARK, fontSize: '20px', fontWeight: 700, margin: 0 }}
        >
          {title}
        </h2>
        <Link
          to={linkTo}
          className="whitespace-nowrap ml-4"
          style={{ color: GREEN, textDecoration: 'underline', fontSize: '16px', fontWeight: 700 }}
        >
          Vis alle
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div style={{ height: 200, borderRadius: 30, backgroundColor: '#A5B98C' }} />
              <div className="mt-3 h-4 rounded" style={{ backgroundColor: '#A5B98C', width: '70%' }} />
              <div className="mt-2 h-3 rounded" style={{ backgroundColor: '#A5B98C', width: '40%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}
