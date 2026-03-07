import { useNavigate } from 'react-router-dom'

const mealTypeLabels = {
  breakfast: 'Morgenmad', lunch: 'Frokost', dinner: 'Aftensmad',
  dessert: 'Dessert', 'main course': 'Aftensmad', salad: 'Salat',
  soup: 'Suppe', snack: 'Snack',
}

export default function RecipeCard({ recipe, translatedTitle }) {
  const navigate = useNavigate()
  const title = translatedTitle || recipe.title
  const image = recipe.image || `https://placehold.co/400x400/e8e2d8/9a9490?text=+`
  const firstType = recipe.dishTypes?.[0]
  const typeLabel = firstType ? (mealTypeLabels[firstType] || firstType) : null

  return (
    <article
      className="bg-white rounded-xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: '0 2px 8px rgba(0,61,26,0.06)' }}
      onClick={() => navigate(`/opskrift/${recipe.id}`)}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3
          className="font-bold text-sm leading-snug line-clamp-2"
          style={{ color: '#003D1A' }}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {typeLabel && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#EBE7DC', color: '#00662B' }}
            >
              {typeLabel}
            </span>
          )}
          {recipe.readyInMinutes && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#EBE7DC', color: '#00662B' }}
            >
              {recipe.readyInMinutes} min
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
