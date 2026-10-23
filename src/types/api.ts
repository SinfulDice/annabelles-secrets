import type { SortOption } from './filters'
import type { Category, Product } from './product'

/** What the shop asks the server for (R17). Shared by the browser and the server. */
export type ProductQuery = {
  query: string
  /** Empty array means "every category". */
  categories: Category[]
  /** Empty string means "all types". */
  type: string
  /** null means "no maximum price". */
  maxPrice: number | null
  waterproofOnly: boolean
  sort: SortOption
  page: number
  pageSize: number
}

/** Answer of GET /api/products: one page, plus what is needed to draw the pagination. */
export type ProductPage = {
  products: Product[]
  /** Number of products matching the criteria, in the whole catalogue. */
  total: number
  /** The page really sent back: the asked page, brought back between 1 and totalPages (R30). */
  page: number
  totalPages: number
  pageSize: number
}

export type CategorySummary = {
  count: number
  /** Product types of the category, sorted alphabetically. */
  types: string[]
}

/** Answer of GET /api/catalog (R18): small, whatever the number of products. */
export type CatalogSummary = {
  total: number
  categories: Record<Category, CategorySummary>
}

/** Body of every error answer of our API. */
export type ApiError = {
  error: string
}
