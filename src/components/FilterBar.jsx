const mealTypes = [
  { key: '', label: 'Alle' },
  { key: 'breakfast', label: 'Morgenmad' },
  { key: 'lunch', label: 'Frokost' },
  { key: 'dinner', label: 'Aftensmad' },
  { key: 'dessert', label: 'Dessert' },
]

export default function FilterBar({ activeType, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {mealTypes.map((type) => {
        const isActive = activeType === type.key
        return (
          <button
            key={type.key}
            onClick={() => onChange(type.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium
                        transition-colors duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400
                        active:scale-95
                        ${isActive
                          ? 'bg-sage-500 text-white shadow-sage'
                          : 'bg-white text-sage-600 shadow-sage hover:bg-sage-50'
                        }`}
          >
            {type.label}
          </button>
        )
      })}
    </div>
  )
}
