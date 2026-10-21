import { CATEGORY_LABELS } from '../constants/config'
import type { Filters } from '../types'
import { formatPrice } from './formatPrice'

export type FilterKey = 'query' | 'category' | 'type' | 'maxPrice' | 'waterproofOnly'

export type ActiveFilter = {
  key: FilterKey
  label: string
}

/** The criteria that differ from their default value, in display order (R32). */
export function getActiveFilters(filters: Filters): ActiveFilter[] {
  const active: ActiveFilter[] = []
  const query = filters.query.trim()

  if (query !== '') active.push({ key: 'query', label: `« ${query} »` })
  if (filters.category !== 'all') {
    active.push({ key: 'category', label: CATEGORY_LABELS[filters.category] })
  }
  if (filters.type !== '') active.push({ key: 'type', label: filters.type })
  if (filters.maxPrice !== null) {
    active.push({ key: 'maxPrice', label: `≤ ${formatPrice(filters.maxPrice)}` })
  }
  if (filters.waterproofOnly) active.push({ key: 'waterproofOnly', label: 'Étanche' })

  return active
}
