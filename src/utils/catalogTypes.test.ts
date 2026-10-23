import { describe, expect, it } from 'vitest'
import type { CatalogSummary } from '../types'
import { typesForCategory } from './catalogTypes'

const catalog: CatalogSummary = {
  total: 4,
  categories: {
    femme: { count: 2, types: ['Lubrifiant', 'Œuf vibrant'] },
    homme: { count: 1, types: ['Lubrifiant'] },
    goodies: { count: 1, types: ['Mug céramique'] },
  },
}

describe('R22 the « Type » filter follows the category', () => {
  it('lists the types of the chosen category', () => {
    expect(typesForCategory(catalog, 'homme')).toEqual(['Lubrifiant'])
  })

  it('« Tous » lists every type once, in French alphabetical order', () => {
    expect(typesForCategory(catalog, 'all')).toEqual(['Lubrifiant', 'Mug céramique', 'Œuf vibrant'])
  })

  it('nothing while the catalogue is not loaded yet', () => {
    expect(typesForCategory(null, 'femme')).toEqual([])
  })
})
