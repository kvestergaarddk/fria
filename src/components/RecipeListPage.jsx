import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import RecipeCard from './RecipeCard'
import { loadAllRecipes } from '../api/recipes'

const BG = '#EEDDB6'
const GREEN = '#315E4A'
const DARK = '#1B3A28'
const CHIP_BG = '#D8C88A'

const PAGE_SIZE = 12

const MEAL_TYPES = [
  { key: '', label: 'Alle' },
  { key: 'breakfast', label: 'Morgenmad' },
  { key: 'lunch', label: 'Frokost' },
  { key: 'dinner', label: 'Aftensmad' },
  { key: 'dessert', label: 'Dessert' },
]

const PROTEINS = [
  { key: '', label: 'Alle' },
  { key: 'chicken', label: 'Kylling' },
  { key: 'meat', label: 'Kød' },
  { key: 'fish', label: 'Fisk & skaldyr' },
  { key: 'vegetarian', label: 'Vegetar' },
]

const CUISINES = [
  { key: '', label: 'Alle køkkener' },
  { key: 'italian', label: 'Italiensk' },
  { key: 'mexican', label: 'Mexicansk' },
  { key: 'spanish', label: 'Spansk' },
  { key: 'french', label: 'Fransk' },
  { key: 'asian', label: 'Asiatisk' },
  { key: 'indian', label: 'Indisk' },
  { key: 'american', label: 'Amerikansk' },
  { key: 'mediterranean', label: 'Middelhavet' },
]

const ASIAN_CUISINES = ['chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'asian']

const CATEGORY_LABELS = {
  glutenfri: 'Glutenfrie opskrifter',
  laktosefri: 'Laktosefri opskrifter',
  begge: 'Glutenfri & laktosefri opskrifter',
}

function FilterChips({ options, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map(opt => {
        const isActive = active === opt.key
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold focus-visible:outline-none active:scale-95"
            style={isActive
              ? { backgroundColor: GREEN, color: '#fff' }
              : { backgroundColor: CHIP_BG, color: DARK }
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function RecipeListPage({ category = 'begge' }) {
  const [mealType, setMealType] = useState('')
  const [protein, setProtein] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadAllRecipes()
      .then(setAllRecipes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [mealType, protein, cuisine])

  const filtered = useMemo(() => {
    return allRecipes.filter(r => {
      if (mealType) {
        const types = r.dishTypes || []
        const match = mealType === 'dinner'
          ? types.some(t => t === 'dinner' || t === 'main course' || t === 'main dish')
          : types.includes(mealType)
        if (!match) return false
      }
      if (protein && r.protein !== protein) return false
      if (cuisine) {
        if (cuisine === 'asian') {
          if (!r.cuisines?.some(c => ASIAN_CUISINES.includes(c))) return false
        } else {
          if (!r.cuisines?.includes(cuisine)) return false
        }
      }
      return true
    })
  }, [allRecipes, mealType, protein, cuisine])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length
  const heading = CATEGORY_LABELS[category] || 'Alle opskrifter'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
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
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          }}
        >
          {heading}
        </h1>
      </header>

      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8 pt-6 pb-4">

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: GREEN }}>Måltid</p>
          <FilterChips options={MEAL_TYPES} active={mealType} onChange={setMealType} />
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: GREEN }}>Protein</p>
          <FilterChips options={PROTEINS} active={protein} onChange={setProtein} />
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: GREEN }}>Køkken</p>
          <FilterChips options={CUISINES} active={cuisine} onChange={setCuisine} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>Der opstod en fejl:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div style={{ height: 200, borderRadius: 30, backgroundColor: '#DFD09A' }} />
                <div className="mt-3 h-4 rounded" style={{ backgroundColor: '#DFD09A', width: '70%' }} />
                <div className="mt-2 h-3 rounded" style={{ backgroundColor: '#DFD09A', width: '40%' }} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold" style={{ color: DARK }}>Ingen opskrifter fundet</p>
            <p className="text-sm mt-2" style={{ color: GREEN }}>Prøv at ændre dine filtre.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <>
            <p className="text-xs mb-4" style={{ color: GREEN }}>
              Viser {visible.length} af {filtered.length} opskrifter
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {visible.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-full text-sm font-semibold border-2 focus-visible:outline-none active:scale-95"
                  style={{ borderColor: GREEN, color: GREEN }}
                >
                  Vis flere opskrifter
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
