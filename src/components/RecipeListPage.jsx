import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from './SEO'
import Logo from './Logo'
import Footer from './Footer'
import RecipeCard from './RecipeCard'
import { loadAllRecipes } from '../api/recipes'

const BG = '#BFCEA3'
const GREEN = '#204636'
const DARK = '#1B3A28'
const CHIP_BG = '#A5B98C'

const PAGE_SIZE = 12

const MEAL_TYPES = [
  { key: '', label: 'Alle' },
  { key: 'dinner', label: 'Aftensmad' },
  { key: 'bakery', label: 'Bagværk' },
  { key: 'dessert', label: 'Dessert' },
]

const PROTEINS = [
  { key: '', label: 'Alle' },
  { key: 'chicken', label: 'Kylling' },
  { key: 'meat', label: 'Kød' },
  { key: 'fish', label: 'Fisk & skaldyr' },
  { key: 'vegetarian', label: 'Vegetar' },
]

const CUISINES = [
  { key: '', label: 'Alle køkkener' },
  { key: 'italian', label: 'Italiensk' },
  { key: 'mexican', label: 'Mexicansk' },
  { key: 'spanish', label: 'Spansk' },
  { key: 'french', label: 'Fransk' },
  { key: 'asian', label: 'Asiatisk' },
  { key: 'indian', label: 'Indisk' },
  { key: 'american', label: 'Amerikansk' },
  { key: 'mediterranean', label: 'Middelhavet' },
]

const ASIAN_CUISINES = ['chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'asian']

const CATEGORY_LABELS = {
  glutenfri: 'Lækre glutenfri opskrifter',
  laktosefri: 'Lækre laktosefri opskrifter',
  begge: 'Lækre glutenfri & laktosefri opskrifter',
}

function FilterChips({ label, options, active, onChange }) {
  return (
    <div>
      <p style={{ color: GREEN, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isActive = active === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className="whitespace-nowrap focus-visible:outline-none active:scale-95"
              style={{
                padding: '8px 16px',
                borderRadius: '23px',
                fontSize: '16px',
                fontWeight: 400,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? GREEN : CHIP_BG,
                color: isActive ? '#fff' : DARK,
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RecipeListPage({ category = 'begge' }) {
  const [mealType, setMealType] = useState('')
  const [protein, setProtein] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    loadAllRecipes()
      .then(setAllRecipes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [mealType, protein, cuisine])

  // Lås scroll når drawer er åben
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen])

  const filtered = useMemo(() => {
    return allRecipes.filter(r => {
      // Filtrer efter diæt-kategori
      if (category === 'glutenfri' && !r.diets?.includes('gluten free')) return false
      if (category === 'laktosefri' && !r.diets?.includes('dairy free')) return false
      if (category === 'begge' && (!r.diets?.includes('gluten free') || !r.diets?.includes('dairy free'))) return false

      if (mealType) {
        const types = r.dishTypes || []
        const match = mealType === 'dinner'
          ? types.some(t => t === 'dinner' || t === 'main course' || t === 'main dish')
          : mealType === 'bakery'
          ? types.some(t => t === 'bakery' || t === 'bread')
          : types.includes(mealType)
        if (!match) return false
      }
      if (protein && r.protein !== protein) return false
      if (cuisine) {
        if (cuisine === 'asian') {
          if (!r.cuisines?.some(c => ASIAN_CUISINES.includes(c))) return false
        } else {
          if (!r.cuisines?.includes(cuisine)) return false
        }
      }
      return true
    })
  }, [allRecipes, category, mealType, protein, cuisine])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length
  const heading = CATEGORY_LABELS[category] || 'Alle opskrifter'

  const activeFilterCount = [mealType, protein, cuisine].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <SEO
        title={category === 'glutenfri' ? 'Glutenfri opskrifter' : category === 'laktosefri' ? 'Laktosefri opskrifter' : 'Glutenfri & laktosefri opskrifter'}
        description={category === 'glutenfri' ? 'Find lækre glutenfri opskrifter uden hvede, rug og byg. Tilpasset til glutenintolerans og cøliaki.' : category === 'laktosefri' ? 'Find lækre laktosefri opskrifter uden mælk, fløde og ost. Tilpasset til laktoseintolerans.' : 'Find opskrifter der er fri for både gluten og laktose. Perfekt til dig med flere intoleranser.'}
        path={`/${category}`}
      />
      {/* Filter drawer overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* Filter drawer */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(400px, 90vw)',
          backgroundColor: BG,
          transform: filterOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          padding: '40px 32px',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between mb-10">
          <span style={{ color: GREEN, fontSize: '24px', fontWeight: 700 }}>Filtre</span>
          <button
            onClick={() => setFilterOpen(false)}
            style={{ color: GREEN, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            aria-label="Luk filtre"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Filter sections */}
        <div className="flex flex-col gap-8">
          <FilterChips label="Måltid" options={MEAL_TYPES} active={mealType} onChange={setMealType} />
          <FilterChips label="Protein" options={PROTEINS} active={protein} onChange={setProtein} />
          <FilterChips label="Køkken" options={CUISINES} active={cuisine} onChange={setCuisine} />
        </div>

        {/* Nulstil */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setMealType(''); setProtein(''); setCuisine('') }}
            className="mt-10"
            style={{
              color: GREEN,
              background: 'none',
              border: `1.5px solid ${GREEN}`,
              borderRadius: '23px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Nulstil filtre
          </button>
        )}
      </div>

      <header className="pt-20 pb-0 flex flex-col items-center text-center px-4 md:px-8">
        <Link to="/" aria-label="Gå til forsiden">
          <Logo color={GREEN} />
        </Link>
        <h1
          className="mt-20 w-full"
          style={{
            color: GREEN,
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 100px)',
            lineHeight: 1,
            maxWidth: '1220px',
          }}
        >
          {heading}
        </h1>
      </header>

      <main className="flex-1 max-w-[1220px] mx-auto w-full px-4 md:px-8 pt-10 pb-4">

        {/* Filter-knap + måltidstype-chips */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              backgroundColor: GREEN,
              color: '#fff',
              fontSize: '20px',
              fontWeight: 400,
              borderRadius: '23px',
              padding: '8px 16px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 2h16M4 7h10M7 12h4"/>
            </svg>
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>

          {MEAL_TYPES.filter(opt => opt.key !== '').map(opt => {
            const isActive = mealType === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setMealType(isActive ? '' : opt.key)}
                className="whitespace-nowrap focus-visible:outline-none active:scale-95"
                style={{
                  padding: '8px 16px',
                  borderRadius: '23px',
                  fontSize: '16px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? GREEN : CHIP_BG,
                  color: isActive ? '#fff' : DARK,
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>Der opstod en fejl:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div style={{ height: 200, borderRadius: 30, backgroundColor: '#A5B98C' }} />
                <div className="mt-3 h-4 rounded" style={{ backgroundColor: '#A5B98C', width: '70%' }} />
                <div className="mt-2 h-3 rounded" style={{ backgroundColor: '#A5B98C', width: '40%' }} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold" style={{ color: DARK }}>Ingen opskrifter fundet</p>
            <p className="text-sm mt-2" style={{ color: GREEN }}>Prøv at ændre dine filtre.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <>
            <p className="text-xs mb-4 text-right" style={{ color: GREEN }}>
              Viser {visible.length} af {filtered.length} opskrifter
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {visible.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-full text-sm font-semibold border-2 focus-visible:outline-none active:scale-95"
                  style={{ borderColor: GREEN, color: GREEN }}
                >
                  Vis flere opskrifter
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
