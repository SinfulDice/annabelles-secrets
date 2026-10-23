import { describe, expect, it } from 'vitest'
import { makeProduct } from '../src/test/makeProduct'
import { DEFAULT_QUERY } from '../src/utils/productQuery'
import { findProduct, queryProducts, summarizeCatalog } from './catalog'

const catalogue = [
  makeProduct({ id: 1, category: 'femme', type: 'Lubrifiant', price: 15, rating: 4.1 }),
  makeProduct({ id: 2, category: 'femme', type: 'Œuf vibrant', price: 60, rating: 4.9 }),
  makeProduct({ id: 3, category: 'homme', type: 'Lubrifiant', price: 15, rating: 4.5 }),
  makeProduct({ id: 4, category: 'goodies', type: 'Mug céramique', price: 18, rating: 4.7 }),
  makeProduct({ id: 5, category: 'homme', type: 'Anneau vibrant', price: 40, rating: 3.9 }),
]
const ids = (page: { products: { id: number }[] }) => page.products.map((product) => product.id)

describe('R11 R17 GET /api/products sends one page, never the whole catalogue', () => {
  it('cuts the sorted catalogue into pages and says how many there are', () => {
    const page = queryProducts(catalogue, { ...DEFAULT_QUERY, pageSize: 2, page: 2 })
    expect(ids(page)).toEqual([3, 1]) // ratings 4.9, 4.7 | 4.5, 4.1 | 3.9
    expect(page).toMatchObject({ total: 5, page: 2, totalPages: 3, pageSize: 2 })
  })

  it('R26 criteria apply to the whole catalogue before the cut', () => {
    const page = queryProducts(catalogue, { ...DEFAULT_QUERY, type: 'Lubrifiant', pageSize: 1 })
    expect(page).toMatchObject({ total: 2, totalPages: 2 })
  })

  it('accepts a list of categories (home page: femme + homme)', () => {
    const page = queryProducts(catalogue, { ...DEFAULT_QUERY, categories: ['femme', 'homme'] })
    expect(ids(page)).toEqual([2, 3, 1, 5])
  })

  it('R30 a page past the end is brought back to the last page', () => {
    const page = queryProducts(catalogue, { ...DEFAULT_QUERY, pageSize: 2, page: 99 })
    expect(page.page).toBe(3)
    expect(ids(page)).toEqual([5])
  })

  it('no result: an empty page 1 sur 1', () => {
    const page = queryProducts(catalogue, { ...DEFAULT_QUERY, query: 'licorne' })
    expect(page).toEqual({ products: [], total: 0, page: 1, totalPages: 1, pageSize: 12 })
  })
})

describe('R18 GET /api/products/:id', () => {
  it('finds a product by its id', () => {
    expect(findProduct(catalogue, '4')?.id).toBe(4)
  })

  it.each(['999', 'abc', '-3', '2.5', ''])('finds nothing for %j (→ 404)', (rawId) => {
    expect(findProduct(catalogue, rawId)).toBeUndefined()
  })
})

describe('R18 R22 GET /api/catalog', () => {
  it('counts the products and lists the types of each category', () => {
    expect(summarizeCatalog(catalogue)).toEqual({
      total: 5,
      categories: {
        femme: { count: 2, types: ['Lubrifiant', 'Œuf vibrant'] },
        homme: { count: 2, types: ['Anneau vibrant', 'Lubrifiant'] },
        goodies: { count: 1, types: ['Mug céramique'] },
      },
    })
  })
})
