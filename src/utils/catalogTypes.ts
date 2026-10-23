import type { CatalogSummary, CategoryFilter } from '../types'

/** Product types offered by the « Type » filter for a category (R22), from /api/catalog. */
export function typesForCategory(catalog: CatalogSummary | null, category: CategoryFilter) {
  if (catalog === null) return []
  if (category !== 'all') return catalog.categories[category].types
  const allTypes = new Set(Object.values(catalog.categories).flatMap((summary) => summary.types))
  return [...allTypes].sort((a, b) => a.localeCompare(b, 'fr'))
}
