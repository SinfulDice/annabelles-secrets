import { describe, expect, it } from 'vitest'
// The app never imports this backup file (R11): only the tests use it, as realistic input.
import productsData from '../../data/products.json'
import reviewsData from '../data/reviews.json'
import type { Product, ProductsResponse, Review } from '../types'
import { getProductReviews } from './productReviews'
import { mulberry32 } from './seededRandom'

const products = (productsData as ProductsResponse).products
const allReviews = reviewsData.reviews as Review[]

function productById(id: number): Product {
  const product = products.find((candidate) => candidate.id === id)
  if (!product) throw new Error(`Produit ${id} absent des données`)
  return product
}

const average = (reviews: Review[]) =>
  reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

describe('R54 reviews are deterministic', () => {
  it('the same seed gives the same random numbers', () => {
    const first = mulberry32(21)
    const second = mulberry32(21)
    expect([first(), first(), first()]).toEqual([second(), second(), second()])
  })

  it('product 21 always gets exactly the same reviews', () => {
    const product = productById(21)
    expect(getProductReviews(product, allReviews)).toEqual(getProductReviews(product, allReviews))
  })

  it('two products get different reviews', () => {
    const idsOf = (id: number) => getProductReviews(productById(id), allReviews).map((r) => r.id)
    expect(idsOf(1)).not.toEqual(idsOf(2))
  })
})

describe('R55 the review pool depends on the category', () => {
  it.each(products)('product $id only gets reviews of its kind', (product) => {
    const expectedKind = product.category === 'goodies' ? 'goodies' : 'toy'
    const kinds = getProductReviews(product, allReviews).map((review) => review.kind)
    expect(kinds.every((kind) => kind === expectedKind)).toBe(true)
  })
})

describe('R56 between 4 and 12 reviews, never twice the same', () => {
  it.each(products)('product $id', (product) => {
    const reviews = getProductReviews(product, allReviews)
    expect(reviews.length).toBeGreaterThanOrEqual(4)
    expect(reviews.length).toBeLessThanOrEqual(12)
    expect(new Set(reviews.map((review) => review.id)).size).toBe(reviews.length)
  })
})

describe('R57 review ratings follow the product rating', () => {
  it.each(products)('product $id: average within 1 star of its rating', (product) => {
    const reviews = getProductReviews(product, allReviews)
    expect(Math.abs(average(reviews) - product.rating)).toBeLessThanOrEqual(1)
  })

  it('over all products, averages stay close to the ratings', () => {
    const gaps = products.map((product) =>
      Math.abs(average(getProductReviews(product, allReviews)) - product.rating),
    )
    expect(gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length).toBeLessThan(0.35)
  })
})

describe('R58 reviews are sorted by date, newest first', () => {
  it('dates never go up', () => {
    const dates = getProductReviews(productById(1), allReviews).map((review) => review.date)
    expect(dates).toEqual(dates.toSorted().reverse())
  })
})
