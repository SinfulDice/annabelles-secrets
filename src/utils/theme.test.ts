import { describe, expect, it } from 'vitest'
import { parseThemeChoice, resolveTheme } from './theme'

describe('R150 theme saved and restored', () => {
  it('restores a saved choice', () => {
    expect(parseThemeChoice('dark')).toBe('dark')
    expect(parseThemeChoice('light')).toBe('light')
  })

  it.each([null, 'sombre', 1])('anything else means "no choice yet" (%j)', (stored) => {
    expect(parseThemeChoice(stored)).toBeNull()
  })
})

describe('R150 default theme follows the system', () => {
  it('without a choice, uses prefers-color-scheme', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('a choice wins over the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})
