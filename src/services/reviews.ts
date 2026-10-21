import reviewsData from '../data/reviews.json'
import type { Review } from '../types'

/**
 * The 500 reviews, bundled with the app (static import: no request needed).
 * TypeScript reads `kind` in the JSON as any string, so we state the real type here.
 */
export const ALL_REVIEWS = reviewsData.reviews as Review[]
