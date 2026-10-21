import type { CategoryFilter, Filters, Product, SortOption } from '../types'
import { normalizeText } from './normalizeText'

type Criteria = Omit<Filters, 'sort' | 'page'>

function matchesQuery(product: Product, normalizedQuery: string): boolean {
  if (normalizedQuery === '') return true
  const searchableText = [product.title, product.brand, product.type, product.material]
    .map(normalizeText)
    .join(' ')
  return searchableText.includes(normalizedQuery)
}

function matchesCategory(product: Product, category: CategoryFilter): boolean {
  return category === 'all' || product.category === category
}

/** Every criterion must match (logical AND), always applied to the full list. */
export function filterProducts(products: Product[], criteria: Criteria): Product[] {
  const normalizedQuery = normalizeText(criteria.query)
  return products.filter(
    (product) =>
      matchesQuery(product, normalizedQuery) &&
      matchesCategory(product, criteria.category) &&
      (criteria.type === '' || product.type === criteria.type) &&
      (criteria.maxPrice === null || product.price <= criteria.maxPrice) &&
      (!criteria.waterproofOnly || product.waterproof),
  )
}

const comparators: Record<SortOption, (a: Product, b: Product) => number> = {
  rating: (a, b) => b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: (a, b) => b.id - a.id,
}

/** Returns a new array; ties are broken by id so the order never changes between renders. */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const compare = comparators[sort]
  return products.toSorted((a, b) => compare(a, b) || a.id - b.id)
}

/** Product types found in the data for a category, sorted alphabetically (French order). */
export function getAvailableTypes(products: Product[], category: CategoryFilter): string[] {
  const types = new Set(
    products.filter((product) => matchesCategory(product, category)).map((product) => product.type),
  )
  return [...types].sort((a, b) => a.localeCompare(b, 'fr'))
}
