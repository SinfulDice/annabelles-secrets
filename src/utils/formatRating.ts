const ratingFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** 4.8 → "4,8/5" (French decimal comma); a created product has no rating yet (R79). */
export function formatRating(rating: number): string {
  if (rating === 0) return 'Pas encore noté'
  return `${ratingFormatter.format(rating)}/5`
}

/** 0 résultat, 1 résultat, 16 résultats. */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`
}
