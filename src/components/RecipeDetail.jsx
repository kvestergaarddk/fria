import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import { fetchRecipeById } from '../api/recipes'

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRecipeById(id)
        if (!cancelled) setRecipe(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EA' }}>
        <header className="pt-10 pb-4 flex flex-col items-center">
          <Logo />
        </header>
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 animate-pulse">
          <div className="rounded-2xl bg-gray-200 mb-8" style={{ aspectRatio: '16/7' }} />
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-10" />
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-4 bg-gray-200 rounded"/>)}</div>
            <div className="md:col-span-3 space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className="h-4 bg-gray-200 rounded"/>)}</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EA' }}>
        <header className="pt-10 pb-4 flex flex-col items-center"><Logo /></header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
            <strong>Kunne ikke hente opskriften:</strong> {error}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!recipe) return null

  // Understøt både pre-genereret format (ingredients/steps arrays) og live Spoonacular format
  const title = recipe.title
  const image = recipe.image || `https://placehold.co/1200x500/cbc5b8/6b6560?text=+`
  const ingredients = recipe.ingredients
    || (recipe.extendedIngredients || []).map(i => i.original)
  const steps = recipe.steps || (() => {
    const s = []
    ;(recipe.analyzedInstructions || []).forEach(b => b.steps.forEach(st => s.push(st.step || '')))
    return s
  })()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EA' }}>
      {/* Header */}
      <header className="pt-10 pb-4 flex flex-col items-center relative px-4">
        <Link to="/" className="absolute left-4 md:left-8 top-10 text-sm font-semibold flex items-center gap-1.5 focus-visible:outline-none rounded"
          style={{ color: '#00662B' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M13 8H3M7 4L3 8l4 4"/>
          </svg>
          Tilbage
        </Link>
        <Logo />
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-8">
        {/* Hero */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/7' }}>
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Titel + meta */}
        <h1 className="font-extrabold mb-2" style={{ color: '#003D1A', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <div className="flex gap-4 mb-8 text-sm" style={{ color: '#00662B' }}>
          {recipe.readyInMinutes && <span>{recipe.readyInMinutes} min</span>}
          {recipe.servings && <span>{recipe.servings} personer</span>}
        </div>

        {/* Ingredienser + fremgangsmåde */}
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          <aside className="md:col-span-2">
            <h2 className="font-bold text-base mb-4" style={{ color: '#003D1A' }}>Ingredienser</h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1A2D1F', lineHeight: 1.6 }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#00662B' }} />
                  {ing}
                </li>
              ))}
            </ul>
          </aside>

          <section className="md:col-span-3">
            <h2 className="font-bold text-xl mb-5" style={{ color: '#003D1A' }}>Sådan gør du</h2>
            {steps.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#6B7B69' }}>Ingen fremgangsmåde tilgængelig.</p>
            ) : (
              <ol className="space-y-5">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 font-extrabold text-xl w-7" style={{ color: '#00662B' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: '#1A2D1F' }}>{step}</p>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-10 text-right font-bold italic" style={{ color: '#00662B', fontSize: '1.1rem' }}>
              Nyd din mad
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
