import { useState } from 'react'
import type { Review } from '../../types'
import { formatDate } from '../../utils/formatDate'
import { formatCount, formatRating } from '../../utils/formatRating'
import { averageRating, filterReviewsByStars, type StarFilter } from '../../utils/reviewStats'
import { Stars } from '../ui/Stars'

type ProductReviewsProps = {
  reviews: Review[]
  productRating: number
}

const FILTERS: { value: StarFilter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 5, label: '5★' },
  { value: 4, label: '4★' },
  { value: 'low', label: '3★ et moins' },
]

export function ProductReviews({ reviews, productRating }: ProductReviewsProps) {
  const [starFilter, setStarFilter] = useState<StarFilter>('all')
  const shownReviews = filterReviewsByStars(reviews, starFilter)
  const average = averageRating(reviews)

  return (
    <section id="avis" aria-labelledby="reviews-title" className="flex scroll-mt-6 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="reviews-title" className="text-2xl font-bold">
            Avis clients
          </h2>
          <p className="text-sm text-ink-muted">
            {formatCount(reviews.length, 'avis', 'avis')}
            {average !== null && ` · moyenne des avis ${formatRating(average)}/5`} · note produit{' '}
            {formatRating(productRating)}/5
          </p>
        </div>
        <fieldset>
          <legend className="sr-only">Filtrer les avis par note</legend>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <label
                key={filter.value}
                className="flex min-h-9 cursor-pointer items-center rounded-full border border-line bg-surface px-3 text-sm has-checked:border-ink has-checked:bg-ink has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-homme"
              >
                <input
                  type="radio"
                  name="review-filter"
                  checked={starFilter === filter.value}
                  onChange={() => setStarFilter(filter.value)}
                  className="sr-only"
                />
                {filter.label} ({filterReviewsByStars(reviews, filter.value).length})
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {shownReviews.length === 0 ? (
        <p className="rounded-card border border-line bg-surface p-5 text-ink-muted">
          Aucun avis avec cette note pour le moment.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shownReviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <Stars rating={review.rating} />
                {review.verifiedPurchase && (
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                    Achat vérifié
                  </span>
                )}
              </div>
              <h3 className="font-semibold">{review.title}</h3>
              <p className="text-sm">{review.comment}</p>
              <p className="mt-auto text-xs text-ink-muted">
                {review.reviewerName} · {formatDate(review.date)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
