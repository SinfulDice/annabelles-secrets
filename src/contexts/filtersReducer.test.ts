import { describe, expect, it } from 'vitest'
import { filtersReducer, initialFilters, type FiltersAction } from './filtersReducer'

const onPage3 = { ...initialFilters, page: 3 }

describe('R28 every criterion change goes back to page 1', () => {
  const changes: FiltersAction[] = [
    { type: 'queryChanged', query: 'silicone' },
    { type: 'categoryChanged', category: 'femme', typesInCategory: [] },
    { type: 'productTypeChanged', productType: 'Vibromasseur wand' },
    { type: 'maxPriceChanged', maxPrice: 50 },
    { type: 'waterproofOnlyChanged', waterproofOnly: true },
    { type: 'sortChanged', sort: 'price-asc' },
  ]

  it.each(changes)('$type resets the page', (action) => {
    expect(filtersReducer(onPage3, action).page).toBe(1)
  })

  it('changing the page keeps the criteria', () => {
    const state = { ...initialFilters, query: 'wand' }
    expect(filtersReducer(state, { type: 'pageChanged', page: 2 })).toEqual({ ...state, page: 2 })
  })

  it('sending the same value again keeps the page (back from a product page)', () => {
    const state = { ...initialFilters, query: 'wand', page: 2 }
    expect(filtersReducer(state, { type: 'queryChanged', query: 'wand' })).toBe(state)
  })

  it('reset brings back every default value', () => {
    const state = { ...initialFilters, query: 'wand', category: 'homme', page: 2 } as const
    expect(filtersReducer(state, { type: 'filtersReset' })).toEqual(initialFilters)
  })
})

describe('R22 changing category clears a type that does not exist there', () => {
  const withType = { ...initialFilters, type: 'Vibromasseur wand' }

  it('keeps the type when the new category has it', () => {
    const next = filtersReducer(withType, {
      type: 'categoryChanged',
      category: 'femme',
      typesInCategory: ['Vibromasseur wand', 'Œuf vibrant'],
    })
    expect(next.type).toBe('Vibromasseur wand')
  })

  it('clears the type when the new category does not have it', () => {
    const next = filtersReducer(withType, {
      type: 'categoryChanged',
      category: 'homme',
      typesInCategory: ['Anneau vibrant'],
    })
    expect(next.type).toBe('')
  })
})
