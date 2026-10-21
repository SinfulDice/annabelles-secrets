import { describe, expect, it } from 'vitest'
import type { Review } from '../types'
import { averageRating, filterReviewsByStars } from './reviewStats'

const review = (id: number, rating: number): Review => ({
  id,
  rating,
  kind: 'toy',
  title: 'Titre',
  comment: 'Commentaire',
  reviewerName: 'Camille D.',
  date: '2026-09-12',
  verifiedPurchase: true,
})

const reviews = [review(1, 5), review(2, 5), review(3, 4), review(4, 3), review(5, 1)]
const ids = (list: Review[]) => list.map((item) => item.id)

describe('R58 review star filter', () => {
  it('« Toutes » keeps every review', () => {
    expect(filterReviewsByStars(reviews, 'all')).toBe(reviews)
  })

  it('5★ and 4★ keep exactly that rating', () => {
    expect(ids(filterReviewsByStars(reviews, 5))).toEqual([1, 2])
    expect(ids(filterReviewsByStars(reviews, 4))).toEqual([3])
  })

  it('« 3★ et moins » groups 3, 2 and 1 stars', () => {
    expect(ids(filterReviewsByStars(reviews, 'low'))).toEqual([4, 5])
  })
})

describe('R58 real average of the reviews', () => {
  it('averages the ratings', () => {
    expect(averageRating(reviews)).toBeCloseTo(3.6)
  })

  it('is null without reviews', () => {
    expect(averageRating([])).toBeNull()
  })
})
