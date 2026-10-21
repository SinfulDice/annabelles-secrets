import { describe, expect, it } from 'vitest'
import { paginate } from './paginate'

const items = Array.from({ length: 25 }, (_, index) => index + 1)

describe('R27 pagination', () => {
  it('cuts the list into pages of the given size', () => {
    const page = paginate(items, 1, 12)
    expect(page.pageItems).toEqual(items.slice(0, 12))
    expect(page.totalPages).toBe(3)
  })

  it('the last page holds the rest', () => {
    expect(paginate(items, 3, 12).pageItems).toEqual([25])
  })

  it('an empty list still has 1 page', () => {
    expect(paginate([], 1, 12)).toEqual({ pageItems: [], currentPage: 1, totalPages: 1 })
  })
})

describe('R30 the page is kept within bounds', () => {
  it('a page after the last one becomes the last one', () => {
    expect(paginate(items, 9, 12).currentPage).toBe(3)
  })

  it('a page below 1 becomes 1', () => {
    expect(paginate(items, 0, 12).currentPage).toBe(1)
  })
})
