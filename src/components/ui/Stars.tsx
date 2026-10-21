const MAX_STARS = 5

type StarsProps = {
  /** Whole number from 0 to 5. */
  rating: number
}

/** ★★★★☆ for the eyes, "4 étoiles sur 5" for screen readers. */
export function Stars({ rating }: StarsProps) {
  const filled = '★'.repeat(rating)
  const empty = '☆'.repeat(MAX_STARS - rating)
  return (
    <span className="tracking-wider text-femme">
      <span aria-hidden="true">
        {filled}
        {empty}
      </span>
      <span className="sr-only">
        {rating} étoile{rating > 1 ? 's' : ''} sur {MAX_STARS}
      </span>
    </span>
  )
}
