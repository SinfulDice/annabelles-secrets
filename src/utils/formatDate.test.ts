import { describe, expect, it } from 'vitest'
import { formatDate, formatLongDate, formatNumericDate } from './formatDate'

describe('R58 review dates', () => {
  it('writes the date in short French form', () => {
    expect(formatDate('2026-09-12')).toBe('12 sept. 2026')
    expect(formatDate('2026-08-03')).toBe('3 août 2026')
  })
})

describe('R103 profile dates', () => {
  it('writes the sign-up date in full and the birth date in numbers', () => {
    expect(formatLongDate('2026-10-21T09:42:00.000Z')).toBe('21 octobre 2026')
    expect(formatNumericDate('1999-04-12')).toBe('12/04/1999')
  })
})
