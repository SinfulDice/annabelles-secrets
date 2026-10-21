export type ReviewKind = 'toy' | 'goodies'

export type Review = {
  id: number
  kind: ReviewKind
  /** Whole number from 1 to 5. */
  rating: number
  title: string
  comment: string
  reviewerName: string
  /** ISO date, e.g. "2026-08-25". */
  date: string
  verifiedPurchase: boolean
}
