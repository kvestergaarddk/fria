const mealTypes = [
  { key: '', label: 'Alle' },
  { key: 'breakfast', label: 'Morgenmad' },
  { key: 'lunch', label: 'Frokost' },
  { key: 'dinner', label: 'Aftensmad' },
  { key: 'dessert', label: 'Dessert' },
]

export default function FilterBar({ activeType, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {mealTypes.map(type => {
        const isActive = activeType === type.key
        return (
          <button
            key={type.key}
            onClick={() => onChange(type.key)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 active:scale-95"
            style={isActive
              ? { backgroundColor: '#00662B', color: '#fff' }
              : { backgroundColor: '#EBE7DC', color: '#003D1A' }
            }
          >
            {type.label}
          </button>
        )
      })}
    </div>
  )
}
