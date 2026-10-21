import type { Category } from './product'

export type CategoryFilter = 'all' | Category

export type SortOption = 'rating' | 'price-asc' | 'price-desc' | 'newest'

export type Filters = {
  query: string
  category: CategoryFilter
  /** Empty string means "all types". */
  type: string
  /** null means "no maximum price". */
  maxPrice: number | null
  waterproofOnly: boolean
  sort: SortOption
  page: number
}
