import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('R58 review dates', () => {
  it('writes the date in short French form', () => {
    expect(formatDate('2026-09-12')).toBe('12 sept. 2026')
    expect(formatDate('2026-08-03')).toBe('3 août 2026')
  })
})
