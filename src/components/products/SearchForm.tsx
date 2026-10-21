import { useState, type FormEvent } from 'react'
import { PRICE_OPTIONS, SORT_LABELS } from '../../constants/config'
import { useFilters } from '../../contexts/FiltersContext'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import type { SortOption } from '../../types'
import type { FilterKey } from '../../utils/activeFilters'
import { getActiveFilters } from '../../utils/activeFilters'
import { formatPrice } from '../../utils/formatPrice'
import { Checkbox } from '../ui/Checkbox'
import { CloseIcon, SearchIcon } from '../ui/icons'
import { Select } from '../ui/Select'
import { CategoryPicker } from './CategoryPicker'
import { FilterChips } from './FilterChips'

type SearchFormProps = {
  searchText: string
  onSearchTextChange: (text: string) => void
  onClearSearch: () => void
  availableTypes: string[]
  onRemoveFilter: (key: FilterKey) => void
  onReset: () => void
}

const priceOptions = [
  { value: '', label: 'Tous les prix' },
  ...PRICE_OPTIONS.map((price) => ({
    value: String(price),
    label: `Jusqu'à ${formatPrice(price)}`,
  })),
]

// A <select> always gives a string: this check lets TypeScript trust it is a real sort option.
function isSortOption(value: string): value is SortOption {
  return value in SORT_LABELS
}

const sortOptions = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }))

export function SearchForm(props: SearchFormProps) {
  const { searchText, onSearchTextChange, onClearSearch, availableTypes } = props
  const { filters, dispatch } = useFilters()
  const selectCategory = useSelectCategory()
  // Mobile only: price, sort and waterproof are folded behind « Plus de filtres » (R83).
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    ...availableTypes.map((type) => ({ value: type, label: type })),
  ]

  // Enter searches right away instead of waiting for the 300 ms delay.
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    dispatch({ type: 'queryChanged', query: searchText })
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-panel border border-line bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="search" className="text-sm font-semibold">
          Rechercher un produit
        </label>
        <div className="flex min-h-12 items-center gap-2 rounded-field border-2 border-field bg-surface px-3 focus-within:border-homme">
          <SearchIcon className="size-5 text-ink-muted" />
          <input
            id="search"
            type="search"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
            placeholder="Nom, marque, matériau…"
            aria-describedby="search-hint"
            className="min-w-0 flex-1 bg-transparent py-2 outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchText !== '' && (
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Effacer la recherche"
              className="grid size-9 place-items-center rounded-full hover:bg-page"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <p id="search-hint" className="text-xs text-ink-muted">
          La recherche se lance automatiquement 300 ms après votre dernière frappe.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <CategoryPicker value={filters.category} onChange={selectCategory} />
        <Select
          id="filter-type"
          label="Type de produit"
          value={filters.type}
          options={typeOptions}
          onChange={(productType) => dispatch({ type: 'productTypeChanged', productType })}
        />
        <button
          type="button"
          onClick={() => setShowMoreFilters((shown) => !shown)}
          aria-expanded={showMoreFilters}
          aria-controls="more-filters"
          className="min-h-11 rounded-field border border-field text-sm font-semibold md:hidden"
        >
          {showMoreFilters ? 'Moins de filtres' : 'Plus de filtres (prix, tri, étanche)'}
        </button>
        <div
          id="more-filters"
          className={`${showMoreFilters ? 'grid' : 'hidden'} gap-4 md:col-span-2 md:grid md:grid-cols-2`}
        >
          <Select
            id="filter-price"
            label="Prix maximum"
            value={filters.maxPrice === null ? '' : String(filters.maxPrice)}
            options={priceOptions}
            onChange={(value) =>
              dispatch({ type: 'maxPriceChanged', maxPrice: value === '' ? null : Number(value) })
            }
          />
          <Select
            id="filter-sort"
            label="Trier par"
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => {
              if (isSortOption(value)) dispatch({ type: 'sortChanged', sort: value })
            }}
          />
        </div>
      </div>

      <div className={`${showMoreFilters ? 'block' : 'hidden'} md:block`}>
        <Checkbox
          id="filter-waterproof"
          label="Étanche uniquement"
          checked={filters.waterproofOnly}
          onChange={(waterproofOnly) => dispatch({ type: 'waterproofOnlyChanged', waterproofOnly })}
        />
      </div>

      <FilterChips
        activeFilters={getActiveFilters(filters)}
        onRemove={props.onRemoveFilter}
        onReset={props.onReset}
      />
    </form>
  )
}
