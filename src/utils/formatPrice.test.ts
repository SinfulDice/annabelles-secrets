import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

// Intl separates thousands and the € sign with non-breaking spaces: \s matches them all.
const withPlainSpaces = (text: string) => text.replace(/\s/g, ' ')

describe('R16 formatPrice', () => {
  it('formats a price in euros, French style', () => {
    expect(withPlainSpaces(formatPrice(89))).toBe('89,00 €')
  })

  it('keeps two decimals and groups thousands', () => {
    expect(withPlainSpaces(formatPrice(1234.5))).toBe('1 234,50 €')
  })
})
