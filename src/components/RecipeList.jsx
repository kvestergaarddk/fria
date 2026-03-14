import { useState, useEffect, useMemo } from 'react'
import Logo from './Logo'
import Footer from './Footer'
import RecipeCard from './RecipeCard'
import { loadAllRecipes } from '../api/recipes'

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

function FilterChips({ options, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map(opt => {
        const isActive = active === opt.key
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 active:scale-95"
            style={isActive
              ? { backgroundColor: '#00662B', color: '#fff' }
              : { backgroundColor: '#EBE7DC', color: '#003D1A' }
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function getStoredBool(key, fallback) {
  const v = localStorage.getItem(key)
  if (v === null) return fallback
  return v === 'true'
}

export default function RecipeList() {
  const [glutenfri] = useState(() => getStoredBool('mavro_glutenfri', true))
  const [laktosefri] = useState(() => getStoredBool('mavro_laktosefri', true))
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
          if (!r.cuisines.some(c => ASIAN_CUISINES.includes(c))) return false
        } else {
          if (!r.cuisines.includes(cuisine)) return false
        }
      }
      return true
    })
  }, [allRecipes, mealType, protein, cuisine])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const intoleranceLabel = glutenfri && laktosefri
    ? 'glutenfri og laktosefri'
    : glutenfri ? 'glutenfri' : 'laktosefri'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EA' }}>
      <header className="pt-10 pb-6 flex flex-col items-center text-center px-4">
        <Logo />
        <h1
          className="mt-8 font-extrabold leading-tight"
          style={{ color: '#003D1A', letterSpacing: 0, maxWidth: '560px', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Hvad har du lyst til at lave i aften?
        </h1>
        <p className="mt-3 text-sm" style={{ color: '#00662B' }}>
          Alle opskrifter er {intoleranceLabel}.
        </p>
      </header>

      <div className="px-4 md:px-8 max-w-[1220px] mx-auto w-full">
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <img
            src="/forside-billede.jpg"
            alt="Mad på bordet"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8 pt-10 pb-4">

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#00662B' }}>Måltid</p>
          <FilterChips options={MEAL_TYPES} active={mealType} onChange={setMealType} />
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#00662B' }}>Protein</p>
          <FilterChips options={PROTEINS} active={protein} onChange={setProtein} />
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#00662B' }}>Køkken</p>
          <FilterChips options={CUISINES} active={cuisine} onChange={setCuisine} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>Der opstod en fejl:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold" style={{ color: '#003D1A' }}>Ingen opskrifter fundet</p>
            <p className="text-sm mt-2" style={{ color: '#00662B' }}>Prøv at ændre dine filtre.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <>
            <p className="text-xs mb-4" style={{ color: '#00662B' }}>
              Viser {visible.length} af {filtered.length} opskrifter
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-full text-sm font-semibold border-2 transition-colors duration-200 active:scale-95 hover:bg-mavro-green hover:text-white focus-visible:outline-none"
                  style={{ borderColor: '#00662B', color: '#00662B' }}
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
