// NFD splits "é" into "e" + an accent mark; \p{Diacritic} (a Unicode category) matches the mark.
// "œ" and "æ" are single letters that NFD does not split, so they are replaced by hand.
const DIACRITICS = /\p{Diacritic}/gu

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replaceAll('œ', 'oe')
    .replaceAll('æ', 'ae')
    .trim()
}
