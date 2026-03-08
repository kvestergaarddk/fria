import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEDDB6' }}>
        <header className="pt-10 pb-4 flex flex-col items-center">
          <Logo />
        </header>
        <div className="max-w-[1220px] mx-auto w-full px-4 md:px-8 py-8 animate-pulse">
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
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEDDB6' }}>
        <header className="pt-10 pb-4 flex flex-col items-center"><Logo /></header>
        <div className="max-w-[1220px] mx-auto px-4 py-8">
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEDDB6' }}>
      {/* Header */}
      <header className="pt-10 pb-4 flex flex-col items-center px-4">
        <Logo />
      </header>

      <main className="max-w-[1220px] mx-auto w-full px-4 md:px-8 pb-8">
        {/* Hero */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/7' }}>
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Titel + meta */}
        <h1 className="font-extrabold mb-2" style={{ color: '#1B3A28', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <div className="flex gap-4 mb-8 text-sm" style={{ color: '#315E4A' }}>
          {recipe.readyInMinutes && <span>{recipe.readyInMinutes} min</span>}
          {recipe.servings && <span>{recipe.servings} personer</span>}
        </div>

        {/* Ingredienser + fremgangsmåde */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 mb-10">
          {/* Ingredienser */}
          <aside className="md:w-[400px] md:flex-shrink-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ color: '#315E4A', fontSize: '20px', fontWeight: 700, margin: 0 }}>Ingredienser</h2>
              <div style={{ color: '#315E4A', fontSize: '20px', fontWeight: 400, lineHeight: '28px' }}>
                {ingredients.map((ing, i) => (
                  <span key={i}>{ing}<br /></span>
                ))}
              </div>
            </div>
          </aside>

          {/* Divider — vandret på mobil, lodret på desktop */}
          <div className="block md:hidden" style={{ height: '1px', backgroundColor: '#315E4A' }} />
          <div className="hidden md:block" style={{ width: '1px', backgroundColor: '#315E4A', flexShrink: 0 }} />

          {/* Fremgangsmåde */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ color: '#315E4A', fontSize: '30px', fontWeight: 700, margin: 0 }}>Sådan gør du</h2>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span style={{ color: '#315E4A', fontSize: '40px', fontFamily: 'Knewave, cursive', fontWeight: 400, lineHeight: 1, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <p style={{ color: '#315E4A', fontSize: '20px', fontWeight: 400, lineHeight: '28px', paddingTop: '8px', margin: 0 }}>
                  {step}
                </p>
              </div>
            ))}
            <div style={{ paddingLeft: '52px' }}>
              <p style={{ color: '#315E4A', fontSize: '20px', fontFamily: 'Knewave, cursive', fontWeight: 400, lineHeight: '28px', margin: 0 }}>
                Nyd din mad
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
