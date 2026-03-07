import { useState, useEffect, useCallback } from 'react'
import Logo from './Logo'
import FilterBar from './FilterBar'
import RecipeCard from './RecipeCard'
import Footer from './Footer'
import { fetchRecipes } from '../api/recipes'
import { translateTexts } from '../api/translate'

const PAGE_SIZE = 12

function getStoredBool(key, fallback) {
  const v = localStorage.getItem(key)
  if (v === null) return fallback
  return v === 'true'
}

export default function RecipeList() {
  const [glutenfri, setGlutenfri] = useState(() => getStoredBool('mavro_glutenfri', true))
  const [laktosefri, setLaktosefri] = useState(() => getStoredBool('mavro_laktosefri', false))
  const [mealType, setMealType] = useState('')
  const [recipes, setRecipes] = useState([])
  const [translatedTitles, setTranslatedTitles] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)

  const intolerances = [glutenfri && 'gluten', laktosefri && 'dairy'].filter(Boolean).join(',')

  const toggleGlutenfri = () => {
    const next = !glutenfri
    setGlutenfri(next)
    localStorage.setItem('mavro_glutenfri', String(next))
  }

  const toggleLaktosefri = () => {
    const next = !laktosefri
    setLaktosefri(next)
    localStorage.setItem('mavro_laktosefri', String(next))
  }

  const loadRecipes = useCallback(async (type, currentOffset, append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const data = await fetchRecipes({ intolerances, type, number: PAGE_SIZE, offset: currentOffset })
      const newRecipes = data.results || []
      setTotal(data.totalResults || 0)

      if (append) setRecipes(prev => [...prev, ...newRecipes])
      else setRecipes(newRecipes)

      const titles = newRecipes.map(r => r.title)
      if (titles.length > 0) {
        const translated = await translateTexts(titles)
        setTranslatedTitles(prev => {
          const next = { ...prev }
          newRecipes.forEach((r, i) => { next[r.id] = translated[i] || r.title })
          return next
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [intolerances])

  useEffect(() => {
    setOffset(0)
    setRecipes([])
    setTranslatedTitles({})
    loadRecipes(mealType, 0, false)
  }, [mealType, intolerances, loadRecipes])

  const handleLoadMore = () => {
    const next = offset + PAGE_SIZE
    setOffset(next)
    loadRecipes(mealType, next, true)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EA' }}>
      {/* Header */}
      <header className="pt-10 pb-6 flex flex-col items-center text-center px-4">
        <Logo />
        <h1
          className="mt-8 font-extrabold leading-tight"
          style={{ color: '#003D1A', letterSpacing: '-0.02em', maxWidth: '560px', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Hvad har du lyst til at lave i aften?
        </h1>
        <p className="mt-3 text-sm" style={{ color: '#00662B' }}>
          God mad. Ingen kompromiser.
        </p>

        {/* Intolerans-toggles */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={toggleGlutenfri}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavro-green active:scale-95"
            style={glutenfri
              ? { backgroundColor: '#00662B', color: '#fff' }
              : { backgroundColor: 'transparent', color: '#00662B', border: '1.5px solid #00662B' }
            }
          >
            Glutenfri
          </button>
          <button
            onClick={toggleLaktosefri}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavro-green active:scale-95"
            style={laktosefri
              ? { backgroundColor: '#00662B', color: '#fff' }
              : { backgroundColor: 'transparent', color: '#00662B', border: '1.5px solid #00662B' }
            }
          >
            Laktosefri
          </button>
        </div>
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

      {/* Filtrer + opskrifter */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-10 pb-4">
        <div className="mb-6">
          <FilterBar activeType={mealType} onChange={t => setMealType(t)} />
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

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold" style={{ color: '#003D1A' }}>Ingen opskrifter fundet</p>
            <p className="text-sm mt-2" style={{ color: '#00662B' }}>Prøv at vælge en anden måltidstype.</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  translatedTitle={translatedTitles[recipe.id]}
                />
              ))}
            </div>

            {recipes.length < total && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full text-sm font-semibold border-2 transition-colors duration-200 active:scale-95 disabled:opacity-50 hover:bg-mavro-green hover:text-white focus-visible:outline-none"
                  style={{ borderColor: '#00662B', color: '#00662B' }}
                >
                  {loadingMore ? 'Henter...' : 'Vis flere opskrifter'}
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
