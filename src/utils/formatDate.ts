const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * "2026-09-12" → "12 sept. 2026". The date is read as UTC so it shows the same day
 * everywhere (a plain "2026-09-12" is midnight UTC, which is the day before in Montréal).
 */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
