import { describe, expect, it } from 'vitest'
import { formatCount, formatRating } from './formatRating'

describe('R40 card rating and R33 result count wording', () => {
  it('writes ratings with one decimal and a comma', () => {
    expect(formatRating(4.8)).toBe('4,8')
    expect(formatRating(4)).toBe('4,0')
  })

  it('uses the singular for 0 and 1, the plural above', () => {
    expect(formatCount(0, 'résultat', 'résultats')).toBe('0 résultat')
    expect(formatCount(1, 'résultat', 'résultats')).toBe('1 résultat')
    expect(formatCount(16, 'résultat', 'résultats')).toBe('16 résultats')
  })
})
