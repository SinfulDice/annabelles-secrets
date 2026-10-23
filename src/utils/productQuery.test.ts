import { describe, expect, it } from 'vitest'
import { initialFilters } from '../contexts/filtersReducer'
import type { ProductQuery } from '../types'
import {
  DEFAULT_QUERY,
  parseProductQueryParams,
  productPagePath,
  toProductQuery,
  toProductQueryParams,
} from './productQuery'

const parse = (search: string) => parseProductQueryParams(new URLSearchParams(search))

describe('R11 R17 filters → query → URL', () => {
  it('the default filters ask for page 1 of everything, with a short address', () => {
    expect(toProductQuery(initialFilters)).toEqual(DEFAULT_QUERY)
    expect(productPagePath(DEFAULT_QUERY)).toBe('/api/products')
  })

  it('a chosen category becomes a list of one category', () => {
    const query = toProductQuery({ ...initialFilters, category: 'homme', page: 2 })
    expect(query).toMatchObject({ categories: ['homme'], page: 2 })
    expect(productPagePath(query)).toBe('/api/products?category=homme&page=2')
  })

  it('every criterion survives the trip browser → URL → server', () => {
    const query: ProductQuery = {
      query: 'onde rosée',
      categories: ['femme', 'homme'],
      type: 'Lubrifiant',
      maxPrice: 49.9,
      waterproofOnly: true,
      sort: 'price-asc',
      page: 3,
      pageSize: 4,
    }
    expect(parseProductQueryParams(toProductQueryParams(query))).toEqual(query)
  })
})

describe('R17 the server never trusts the URL', () => {
  it('no parameter at all gives the defaults', () => {
    expect(parse('')).toEqual(DEFAULT_QUERY)
  })

  it('unknown categories are dropped, duplicates removed', () => {
    expect(parse('category=femme,licorne,femme').categories).toEqual(['femme'])
    expect(parse('category=licorne').categories).toEqual([])
  })

  it.each(['0', '-2', '1.5', 'abc', ''])('page=%j falls back to page 1', (page) => {
    expect(parse(`page=${page}`).page).toBe(1)
  })

  it('pageSize is limited to 48: nobody can download the whole catalogue at once', () => {
    expect(parse('pageSize=48').pageSize).toBe(48)
    expect(parse('pageSize=25000').pageSize).toBe(12)
    expect(parse('pageSize=0').pageSize).toBe(12)
  })

  it('an invalid price, sort or waterproof value takes its default', () => {
    expect(parse('maxPrice=abc&sort=cheapest&waterproof=yes')).toMatchObject({
      maxPrice: null,
      sort: 'rating',
      waterproofOnly: false,
    })
    expect(parse('maxPrice=-5').maxPrice).toBeNull()
  })
})
