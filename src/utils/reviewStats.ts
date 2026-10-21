import type { Review } from '../types'

export type StarFilter = 'all' | 5 | 4 | 'low'

/** « 3★ et moins » groups the low ratings, which are rare (R58). */
export const LOW_RATING_MAX = 3

export function filterReviewsByStars(reviews: Review[], filter: StarFilter): Review[] {
  if (filter === 'all') return reviews
  if (filter === 'low') return reviews.filter((review) => review.rating <= LOW_RATING_MAX)
  return reviews.filter((review) => review.rating === filter)
}

/** Real average of the reviews shown, or null when there are none. */
export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
}
