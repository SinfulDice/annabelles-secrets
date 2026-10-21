import {
  MAX_REVIEWS_PER_PRODUCT,
  MIN_REVIEWS_PER_PRODUCT,
  REVIEW_DIP_CHANCE,
} from '../constants/config'
import type { Product, Review } from '../types'
import { mulberry32, randomInt } from './seededRandom'

/**
 * Draws a whole star rating around the product rating: 4.6 gives 5 (60 % of the time)
 * or 4 (40 %), and now and then one star less, so a 3 can appear.
 */
function drawTargetRating(productRating: number, random: () => number): number {
  const lower = Math.floor(productRating)
  const rating = random() < productRating - lower ? lower + 1 : lower
  const withDip = random() < REVIEW_DIP_CHANCE ? rating - 1 : rating
  return Math.min(5, Math.max(1, withDip))
}

/** Reviews whose rating is the closest to the target (e.g. no 2★ goodies review exists). */
function closestRatingReviews(reviews: Review[], targetRating: number): Review[] {
  const distance = (review: Review) => Math.abs(review.rating - targetRating)
  const smallestDistance = Math.min(...reviews.map(distance))
  return reviews.filter((review) => distance(review) === smallestDistance)
}

/**
 * Picks the reviews shown on a product page. The generator is seeded with the product id,
 * so a product always gets the same reviews, on every visit and every browser.
 */
export function getProductReviews(product: Product, allReviews: Review[]): Review[] {
  // A product created in this browser was never bought: no reviews yet (R79).
  if (product.isLocal) return []
  const random = mulberry32(product.id)
  const kind = product.category === 'goodies' ? 'goodies' : 'toy'
  const available = allReviews.filter((review) => review.kind === kind)
  const count = randomInt(random, MIN_REVIEWS_PER_PRODUCT, MAX_REVIEWS_PER_PRODUCT)
  const picked: Review[] = []

  while (picked.length < count && available.length > 0) {
    const candidates = closestRatingReviews(available, drawTargetRating(product.rating, random))
    const chosen = candidates[Math.floor(random() * candidates.length)]
    if (!chosen) break
    picked.push(chosen)
    // Removed from the pool so the same review never appears twice on a page.
    available.splice(available.indexOf(chosen), 1)
  }

  return picked.sort((a, b) => b.date.localeCompare(a.date))
}
