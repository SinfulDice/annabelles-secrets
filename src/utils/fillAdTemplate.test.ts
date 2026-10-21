import { describe, expect, it } from 'vitest'
import { AD_MESSAGES } from '../constants/ads'
import { CITIES } from '../constants/cities'
import { drawAd, fillAdTemplate, pickNextAdIndex } from './fillAdTemplate'
import { mulberry32 } from './seededRandom'

describe('R121 ad templates', () => {
  it('replaces every {ville} and {n}', () => {
    expect(fillAdTemplate('{n} km de {ville}, {n} fois', { ville: 'Paris', n: 3 })).toBe(
      '3 km de Paris, 3 fois',
    )
  })

  it('a drawn ad has no variable left', () => {
    const random = mulberry32(7)
    for (let draw = 0; draw < 200; draw += 1) {
      const ad = drawAd(null, random)
      expect(`${ad.title} ${ad.subtitle} ${ad.badge}`).not.toMatch(/\{(ville|n)\}/)
    }
  })

  it('fills a real city and a number from 3 to 27, the same in subtitle and badge', () => {
    // Only the first message: « Elles sont à {n} km de {ville}… », badge « {n} km ».
    const firstMessage = AD_MESSAGES.slice(0, 1)
    const random = mulberry32(3)
    for (let draw = 0; draw < 200; draw += 1) {
      const ad = drawAd(null, random, firstMessage)
      const [, number = '', city = ''] = /à (\d+) km de (.+) et/.exec(ad.subtitle) ?? []
      expect(Number(number)).toBeGreaterThanOrEqual(3)
      expect(Number(number)).toBeLessThanOrEqual(27)
      expect(CITIES).toContain(city)
      expect(ad.badge).toBe(`${number} km`)
    }
  })
})

describe('R122 the next ad is never the previous one', () => {
  it.each([0, 3, 7])('after message %i, 500 draws never repeat it', (previous) => {
    const random = mulberry32(previous + 1)
    for (let draw = 0; draw < 500; draw += 1) {
      const next = pickNextAdIndex(AD_MESSAGES.length, previous, random)
      expect(next).not.toBe(previous)
      expect(next).toBeGreaterThanOrEqual(0)
      expect(next).toBeLessThan(AD_MESSAGES.length)
    }
  })

  it('every other message can come out', () => {
    const random = mulberry32(42)
    const seen = new Set(Array.from({ length: 500 }, () => pickNextAdIndex(8, 0, random)))
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})
