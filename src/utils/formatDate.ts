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

const longDateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })
const numericDateFormatter = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC' })

/** A date-time "2026-10-21T09:42:00.000Z" → "21 octobre 2026", in the user's time zone. */
export function formatLongDate(isoDateTime: string): string {
  return longDateFormatter.format(new Date(isoDateTime))
}

/** A birth date "1999-04-12" → "12/04/1999" (read as UTC, like formatDate). */
export function formatNumericDate(isoDate: string): string {
  return numericDateFormatter.format(new Date(isoDate))
}
