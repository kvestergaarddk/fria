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
      <header className="pt-10 pb-6 flex flex-col items-center text-center px-4">
        <Link to="/" aria-label="Gå til forsiden">
          <Logo color={GREEN} />
        </Link>

        <h1
          className="mt-8 font-extrabold leading-tight"
          style={{
            color: DARK,
            letterSpacing: '-0.02em',
            maxWidth: '560px',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          Hvad har du lyst til at lave i aften?
        </h1>

        <p className="mt-3 text-sm" style={{ color: GREEN, maxWidth: '420px' }}>
          Gå på opdagelse i flere hundrede lækre opskrifter,{' '}
          <Link
            to="/glutenfri"
            style={{ color: GREEN, textDecoration: 'underline', fontWeight: 600 }}
          >
            uden gluten
          </Link>
          ,{' '}
          <Link
            to="/laktosefri"
            style={{ color: GREEN, textDecoration: 'underline', fontWeight: 600 }}
          >
            laktose
          </Link>
          {' '}eller{' '}
          <Link
            to="/begge"
            style={{ color: GREEN, textDecoration: 'underline', fontWeight: 600 }}
          >
            begge dele
          </Link>
          .
        </p>
      </header>

      {/* Hero-billede */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <img
            src="/forside-billede.jpg"
            alt="Mad på bordet"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Opskriftsektioner */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-14 pb-4">

        <RecipeSection
          title="Glutenfrie retter på under 30 min."
          linkTo="/glutenfri"
          recipes={glutenQuick}
          loading={loading}
        />

        <div className="mt-14">
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
          className="font-bold"
          style={{ color: DARK, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}
        >
          {title}
        </h2>
        <Link
          to={linkTo}
          className="text-sm font-semibold whitespace-nowrap ml-4"
          style={{ color: GREEN, textDecoration: 'underline' }}
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
