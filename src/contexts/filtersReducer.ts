import type { CategoryFilter, Filters, SortOption } from '../types'

export const initialFilters: Filters = {
  query: '',
  category: 'all',
  type: '',
  maxPrice: null,
  waterproofOnly: false,
  sort: 'rating',
  page: 1,
}

export type FiltersAction =
  | { type: 'queryChanged'; query: string }
  | { type: 'categoryChanged'; category: CategoryFilter; typesInCategory: string[] }
  | { type: 'productTypeChanged'; productType: string }
  | { type: 'maxPriceChanged'; maxPrice: number | null }
  | { type: 'waterproofOnlyChanged'; waterproofOnly: boolean }
  | { type: 'sortChanged'; sort: SortOption }
  | { type: 'pageChanged'; page: number }
  | { type: 'filtersReset' }

/**
 * Applies a criterion change and goes back to page 1 (R28).
 * If nothing actually changes, the same state is returned: coming back from a product page
 * re-sends the current search, and that must not lose the page the user was on.
 */
function changeCriteria(state: Filters, changes: Partial<Filters>): Filters {
  const next = { ...state, ...changes }
  const hasChanged = (Object.keys(changes) as (keyof Filters)[]).some(
    (key) => next[key] !== state[key],
  )
  return hasChanged ? { ...next, page: 1 } : state
}

export function filtersReducer(state: Filters, action: FiltersAction): Filters {
  switch (action.type) {
    case 'queryChanged':
      return changeCriteria(state, { query: action.query })
    case 'categoryChanged': {
      // R22: a type that does not exist in the new category would always give 0 results.
      const keepsType = action.typesInCategory.includes(state.type)
      return changeCriteria(state, {
        category: action.category,
        type: keepsType ? state.type : '',
      })
    }
    case 'productTypeChanged':
      return changeCriteria(state, { type: action.productType })
    case 'maxPriceChanged':
      return changeCriteria(state, { maxPrice: action.maxPrice })
    case 'waterproofOnlyChanged':
      return changeCriteria(state, { waterproofOnly: action.waterproofOnly })
    case 'sortChanged':
      return changeCriteria(state, { sort: action.sort })
    case 'pageChanged':
      return { ...state, page: action.page }
    case 'filtersReset':
      return initialFilters
  }
}
