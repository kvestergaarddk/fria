import { useNavigate } from 'react-router-dom'

const mealTypeLabels = {
  breakfast: 'Morgenmad',
  lunch: 'Frokost',
  dinner: 'Aftensmad',
  dessert: 'Dessert',
  'main course': 'Aftensmad',
  salad: 'Salat',
  soup: 'Suppe',
  snack: 'Snack',
  beverage: 'Drik',
  sauce: 'Sauce',
}

export default function RecipeCard({ recipe, translatedTitle }) {
  const navigate = useNavigate()

  const title = translatedTitle || recipe.title
  const mealTypes = recipe.dishTypes || []
  const firstType = mealTypes[0] ? mealTypeLabels[mealTypes[0]] || mealTypes[0] : null
  const image = recipe.image || `https://placehold.co/400x300/e3ebe3/5c7a5a?text=Opskrift`

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sage cursor-pointer
                 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-sage-lg
                 focus-within:ring-2 focus-within:ring-sage-400"
      onClick={() => navigate(`/opskrift/${recipe.id}`)}
    >
      {/* Billede */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Farvelag */}
        <div className="absolute inset-0 bg-sage-500/10 mix-blend-multiply" />

        {/* Type-badge */}
        {firstType && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-sage-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {firstType}
          </span>
        )}
      </div>

      {/* Indhold */}
      <div className="p-4">
        <h3 className="font-serif text-lg text-forest leading-snug line-clamp-2 mb-2">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sage-500 text-sm">
          {recipe.readyInMinutes && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="7" cy="7" r="5.5" />
                <path d="M7 4v3l2 1.5" />
              </svg>
              {recipe.readyInMinutes} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M7 2v10M4 5c0-1.5 1.5-3 3-3s3 1.5 3 3" />
                <path d="M3 12h8" />
              </svg>
              {recipe.servings} pers.
            </span>
          )}
        </div>
      </div>

      {/* Invisible link for accessibility */}
      <button
        className="absolute inset-0 opacity-0 focus-visible:opacity-0"
        aria-label={`Se opskrift: ${title}`}
        onClick={() => navigate(`/opskrift/${recipe.id}`)}
      />
    </article>
  )
}
