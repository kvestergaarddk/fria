import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { fetchRecipeById } from '../api/recipes'
import { translateTexts } from '../api/translate'

const nutrientLabels = {
  Calories: 'Kalorier',
  Protein: 'Protein',
  Carbohydrates: 'Kulhydrater',
  Fat: 'Fedt',
  Fiber: 'Kostfibre',
  Sugar: 'Sukker',
  Sodium: 'Natrium',
}

const wantedNutrients = Object.keys(nutrientLabels)

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [translations, setTranslations] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRecipeById(id)
        if (cancelled) return
        setRecipe(data)

        // Saml tekster der skal oversættes
        const title = data.title || ''
        const ingredients = (data.extendedIngredients || []).map((ing) => ing.original || '')
        const steps = []
        const instructions = data.analyzedInstructions || []
        instructions.forEach((block) => {
          block.steps.forEach((s) => steps.push(s.step || ''))
        })

        const allTexts = [title, ...ingredients, ...steps]
        const translated = await translateTexts(allTexts)

        if (cancelled) return

        const result = {}
        result.title = translated[0] || title
        result.ingredients = ingredients.map((_, i) => translated[1 + i] || ingredients[i])
        result.steps = steps.map((_, i) => translated[1 + ingredients.length + i] || steps[i])
        setTranslations(result)
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
      <div className="min-h-screen bg-cream-100">
        <Navbar showBack />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="rounded-2xl aspect-[16/7] bg-cream-300 mb-8" />
          <div className="h-8 bg-cream-300 rounded w-2/3 mb-4" />
          <div className="h-4 bg-cream-200 rounded w-1/3 mb-10" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-cream-200 rounded" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-cream-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Navbar showBack />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
            <strong>Kunne ikke hente opskriften:</strong> {error}
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) return null

  const title = translations.title || recipe.title
  const image = recipe.image || `https://placehold.co/1200x500/e3ebe3/5c7a5a?text=Opskrift`

  const nutrients = (recipe.nutrition?.nutrients || [])
    .filter((n) => wantedNutrients.includes(n.name))
    .sort((a, b) => wantedNutrients.indexOf(a.name) - wantedNutrients.indexOf(b.name))

  const ingredients = translations.ingredients || (recipe.extendedIngredients || []).map((i) => i.original)

  const allSteps = []
  ;(recipe.analyzedInstructions || []).forEach((block) => {
    block.steps.forEach((s) => allSteps.push(s.step || ''))
  })
  const steps = translations.steps || allSteps

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar showBack />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero-billede */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-8 shadow-sage-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-sage-500/10 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight" style={{ letterSpacing: '-0.03em' }}>
              {title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
              {recipe.readyInMinutes && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="7" cy="7" r="5.5" />
                    <path d="M7 4v3l2 1.5" />
                  </svg>
                  {recipe.readyInMinutes} min
                </span>
              )}
              {recipe.servings && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M4 12V7a3 3 0 0 1 6 0v5M3 12h8" />
                  </svg>
                  {recipe.servings} personer
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Indhold: ingredienser + fremgangsmåde */}
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          {/* Ingredienser */}
          <aside className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sage">
              <h2 className="font-serif text-xl text-forest mb-4">Ingredienser</h2>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-sage-700 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sage-400 flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Fremgangsmåde */}
          <section className="md:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-sage">
              <h2 className="font-serif text-xl text-forest mb-4">Fremgangsmåde</h2>
              {steps.length === 0 ? (
                <p className="text-sage-500 text-sm italic">Ingen fremgangsmåde tilgængelig.</p>
              ) : (
                <ol className="space-y-5">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sage-100 text-sage-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-sage-700 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>

        {/* Næringsindhold */}
        {nutrients.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow-sage">
            <h2 className="font-serif text-xl text-forest mb-5">Næringsindhold</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {nutrients.map((n) => (
                <div key={n.name} className="bg-cream-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-semibold text-forest">
                    {Math.round(n.amount)}
                    <span className="text-sm font-normal text-sage-500 ml-0.5">{n.unit}</span>
                  </p>
                  <p className="text-sage-500 text-xs mt-1">{nutrientLabels[n.name] || n.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
