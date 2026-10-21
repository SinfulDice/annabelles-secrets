const ratingFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** 4.8 → "4,8" (French decimal comma). */
export function formatRating(rating: number): string {
  return ratingFormatter.format(rating)
}

/** 0 résultat, 1 résultat, 16 résultats. */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`
}
