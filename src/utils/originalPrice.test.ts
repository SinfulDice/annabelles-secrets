import { describe, expect, it } from 'vitest'
import { getOriginalPrice } from './originalPrice'

describe('R51 original price before discount', () => {
  it('computes the price before a 10 % discount, rounded to the cent', () => {
    expect(getOriginalPrice(89, 10)).toBe(98.89)
  })

  it('returns null without a discount', () => {
    expect(getOriginalPrice(89, 0)).toBeNull()
  })
})
