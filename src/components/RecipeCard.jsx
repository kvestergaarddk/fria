import { useNavigate } from 'react-router-dom'

const mealTypeLabels = {
  breakfast: 'Morgenmad', lunch: 'Frokost', dinner: 'Aftensmad',
  dessert: 'Dessert', 'main course': 'Aftensmad', salad: 'Salat',
  soup: 'Suppe', snack: 'Snack',
}

export default function RecipeCard({ recipe, translatedTitle }) {
  const navigate = useNavigate()
  const title = translatedTitle || recipe.title
  const image = recipe.image || null
  const firstType = recipe.dishTypes?.[0]
  const typeLabel = firstType ? (mealTypeLabels[firstType] || firstType) : null

  return (
    <article
      className="group cursor-pointer"
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      onClick={() => navigate(`/opskrift/${recipe.id}`)}
    >
      {/* Billedboks */}
      <div
        style={{
          padding: '20px',
          aspectRatio: '1 / 1',
          background: '#BFCEA3',
          borderRadius: '30px',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {image && (
          <img
            src={image}
            alt={title}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              mixBlendMode: 'multiply',
              transition: 'transform 0.5s ease',
            }}
            className="group-hover:scale-105"
          />
        )}
        {/* Måltidstype-tag på billedet */}
        {typeLabel && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '23px',
                backgroundColor: 'rgba(191,206,163,0.92)',
                color: '#1B3A28',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {typeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Titel */}
      <h3
        style={{
          color: '#204636',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '25px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0,
        }}
      >
        {title}
      </h3>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {recipe.readyInMinutes && (
          <span style={{ color: '#204636', fontSize: '14px', fontWeight: 500 }}>
            {recipe.readyInMinutes} min.
          </span>
        )}
        {recipe.servings && (
          <span style={{ color: '#204636', fontSize: '14px', fontWeight: 500 }}>
            {recipe.servings} personer
          </span>
        )}
      </div>
    </article>
  )
}
