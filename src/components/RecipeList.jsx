import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import FilterBar from './FilterBar'
import RecipeCard from './RecipeCard'
import { fetchRecipes } from '../api/recipes'
import { translateTexts } from '../api/translate'

const PAGE_SIZE = 12

export default function RecipeList() {
  const navigate = useNavigate()
  const intolerances = localStorage.getItem('fria_intolerances') || ''

  const [mealType, setMealType] = useState('')
  const [recipes, setRecipes] = useState([])
  const [translatedTitles, setTranslatedTitles] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)

  // Redirect hvis ingen intolerans valgt
  useEffect(() => {
    if (!intolerances) navigate('/', { replace: true })
  }, [intolerances, navigate])

  const loadRecipes = useCallback(async (type, currentOffset, append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const data = await fetchRecipes({ intolerances, type, number: PAGE_SIZE, offset: currentOffset })

      const newRecipes = data.results || []
      setTotal(data.totalResults || 0)

      if (append) {
        setRecipes((prev) => [...prev, ...newRecipes])
      } else {
        setRecipes(newRecipes)
      }

      // Oversæt titler
      const titles = newRecipes.map((r) => r.title)
      if (titles.length > 0) {
        const translated = await translateTexts(titles)
        setTranslatedTitles((prev) => {
          const next = { ...prev }
          newRecipes.forEach((r, i) => {
            next[r.id] = translated[i] || r.title
          })
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
  }, [mealType, loadRecipes])

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE
    setOffset(newOffset)
    loadRecipes(mealType, newOffset, true)
  }

  const hasMore = recipes.length < total

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtre */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-forest mb-4" style={{ letterSpacing: '-0.03em' }}>
            Opskrifter
          </h1>
          <FilterBar activeType={mealType} onChange={(t) => setMealType(t)} />
        </div>

        {/* Fejl */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>Der opstod en fejl:</strong> {error}
            <br />
            <span className="text-red-500 text-xs mt-1 block">
              Tjek at dine API-nøgler er korrekt indsat i .env-filen.
            </span>
          </div>
        )}

        {/* Skeleton loader */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sage animate-pulse">
                <div className="aspect-[4/3] bg-cream-300" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-cream-300 rounded w-3/4" />
                  <div className="h-4 bg-cream-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ingen resultater */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-sage-400 mb-2">Ingen opskrifter fundet</p>
            <p className="text-sage-500 text-sm">Prøv at vælge en anden måltidstype.</p>
          </div>
        )}

        {/* Opskrifts-grid */}
        {!loading && recipes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  translatedTitle={translatedTitles[recipe.id]}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white text-sage-600 font-medium px-8 py-3 rounded-full shadow-sage
                             transition-all duration-200 hover:bg-sage-50 hover:shadow-sage-lg
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400
                             active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Henter...' : 'Indlæs flere opskrifter'}
                </button>
              </div>
            )}

            <p className="text-center text-sage-400 text-xs mt-4">
              Viser {recipes.length} af {total} opskrifter
            </p>
          </>
        )}
      </main>
    </div>
  )
}
