import { describe, expect, it } from 'vitest'
import { safeRedirect } from './redirect'

describe('R106 return to the requested page after signing in', () => {
  it('accepts an address inside the site', () => {
    expect(safeRedirect('/produits/nouveau')).toBe('/produits/nouveau')
  })

  it.each([null, '', 'https://evil.example', '//evil.example', '/\\evil.example', 'produits'])(
    'refuses %j',
    (target) => {
      expect(safeRedirect(target)).toBeNull()
    },
  )
})
