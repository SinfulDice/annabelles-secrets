import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import { filterProducts, getAvailableTypes, sortProducts } from './filterProducts'

const noCriteria = {
  query: '',
  category: 'all',
  type: '',
  maxPrice: null,
  waterproofOnly: false,
} as const

const products = [
  makeProduct({
    id: 1,
    title: 'Onde Rosée',
    category: 'femme',
    type: 'Stimulateur à ondes',
    price: 89,
    rating: 4.8,
  }),
  makeProduct({
    id: 2,
    title: 'Orbite',
    category: 'homme',
    type: 'Anneau vibrant',
    price: 34.9,
    rating: 4.6,
    waterproof: true,
  }),
  makeProduct({
    id: 3,
    title: 'Velouté',
    category: 'femme',
    type: 'Œuf vibrant',
    price: 44,
    rating: 4.3,
    waterproof: true,
    material: 'Silicone doux',
  }),
  makeProduct({
    id: 4,
    title: 'Mug',
    category: 'goodies',
    type: 'Mug céramique',
    price: 14.9,
    rating: 4.6,
    material: 'Céramique',
  }),
]

const ids = (list: { id: number }[]) => list.map((product) => product.id)

describe('R20 text search', () => {
  it('matches the title without case or accents', () => {
    expect(ids(filterProducts(products, { ...noCriteria, query: 'ROSEE' }))).toEqual([1])
  })

  it('matches the type, the material and the brand', () => {
    expect(ids(filterProducts(products, { ...noCriteria, query: 'oeuf' }))).toEqual([3])
    expect(ids(filterProducts(products, { ...noCriteria, query: 'ceramique' }))).toEqual([4])
    expect(filterProducts(products, { ...noCriteria, query: 'annabelle' })).toHaveLength(4)
  })

  it('an empty query keeps everything', () => {
    expect(filterProducts(products, { ...noCriteria, query: '   ' })).toHaveLength(4)
  })
})

describe('R21 category filter', () => {
  it('keeps only the chosen category', () => {
    expect(ids(filterProducts(products, { ...noCriteria, category: 'femme' }))).toEqual([1, 3])
  })
})

describe('R22 product types depend on the category', () => {
  it('lists the types of the category, sorted', () => {
    expect(getAvailableTypes(products, 'femme')).toEqual(['Œuf vibrant', 'Stimulateur à ondes'])
  })

  it('lists every type for "all"', () => {
    expect(getAvailableTypes(products, 'all')).toHaveLength(4)
  })

  it('filters by type', () => {
    expect(ids(filterProducts(products, { ...noCriteria, type: 'Anneau vibrant' }))).toEqual([2])
  })
})

describe('R23 maximum price', () => {
  it('keeps products at or under the maximum', () => {
    expect(ids(filterProducts(products, { ...noCriteria, maxPrice: 44 }))).toEqual([2, 3, 4])
  })
})

describe('R24 waterproof only', () => {
  it('keeps only waterproof products', () => {
    expect(ids(filterProducts(products, { ...noCriteria, waterproofOnly: true }))).toEqual([2, 3])
  })
})

describe('R25 sorting', () => {
  it('best rated first, ties broken by id', () => {
    expect(ids(sortProducts(products, 'rating'))).toEqual([1, 2, 4, 3])
  })

  it('price ascending and descending', () => {
    expect(ids(sortProducts(products, 'price-asc'))).toEqual([4, 2, 3, 1])
    expect(ids(sortProducts(products, 'price-desc'))).toEqual([1, 3, 2, 4])
  })

  it('newest = highest id first', () => {
    expect(ids(sortProducts(products, 'newest'))).toEqual([4, 3, 2, 1])
  })

  it('does not modify the original array', () => {
    sortProducts(products, 'newest')
    expect(ids(products)).toEqual([1, 2, 3, 4])
  })
})

describe('R26 all criteria combine (logical AND)', () => {
  it('every result matches every criterion', () => {
    const result = filterProducts(products, {
      query: 'vibrant',
      category: 'femme',
      type: '',
      maxPrice: 50,
      waterproofOnly: true,
    })
    expect(ids(result)).toEqual([3])
  })

  it('returns an empty list when nothing matches all criteria', () => {
    expect(
      filterProducts(products, { ...noCriteria, category: 'goodies', waterproofOnly: true }),
    ).toEqual([])
  })
})
