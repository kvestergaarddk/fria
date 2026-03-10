import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import RecipeCard from './RecipeCard'
import { loadAllRecipes } from '../api/recipes'

const BG = '#EEDDB6'
const GREEN = '#315E4A'
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
            <Link to="/glutenfri" className="hover:!text-[#EFBA5A] transition-colors duration-200" style={{ color: GREEN, textDecoration: 'underline', fontWeight: 700 }}>
              uden gluten
            </Link>
            ,{' '}
            <Link to="/laktosefri" className="hover:!text-[#EFBA5A] transition-colors duration-200" style={{ color: GREEN, textDecoration: 'underline', fontWeight: 700 }}>
              laktose
            </Link>
            {' '}eller{' '}
            <Link to="/begge" className="hover:!text-[#EFBA5A] transition-colors duration-200" style={{ color: GREEN, textDecoration: 'underline', fontWeight: 700 }}>
              begge dele
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
              <div style={{ height: 200, borderRadius: 30, backgroundColor: '#DFD09A' }} />
              <div className="mt-3 h-4 rounded" style={{ backgroundColor: '#DFD09A', width: '70%' }} />
              <div className="mt-2 h-3 rounded" style={{ backgroundColor: '#DFD09A', width: '40%' }} />
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
