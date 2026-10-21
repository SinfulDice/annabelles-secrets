import { describe, expect, it } from 'vitest'
import { initialFilters } from '../contexts/filtersReducer'
import { getActiveFilters } from './activeFilters'

const labels = (filters: typeof initialFilters) =>
  getActiveFilters(filters).map((filter) => filter.label.replace(/\s/g, ' '))

describe('R32 active filter chips', () => {
  it('shows nothing with the default filters', () => {
    expect(getActiveFilters(initialFilters)).toEqual([])
  })

  it('lists every criterion that is set, in order', () => {
    const filters = {
      ...initialFilters,
      query: ' silicone ',
      category: 'femme',
      type: 'Vibromasseur wand',
      maxPrice: 120,
      waterproofOnly: true,
    } as const
    expect(labels(filters)).toEqual([
      '« silicone »',
      'Femme',
      'Vibromasseur wand',
      '≤ 120,00 €',
      'Étanche',
    ])
  })

  it('ignores a search made only of spaces, and the sort order', () => {
    expect(getActiveFilters({ ...initialFilters, query: '   ', sort: 'newest' })).toEqual([])
  })
})
