import { describe, expect, it } from 'vitest'
import { normalizeText } from './normalizeText'

describe('R20 normalizeText', () => {
  it('ignores case', () => {
    expect(normalizeText('SiLiCoNe')).toBe('silicone')
  })

  it('removes accents', () => {
    expect(normalizeText('Onde Rosée à Étretat')).toBe('onde rosee a etretat')
  })

  it('turns œ into oe so "oeuf" finds "Œuf vibrant"', () => {
    expect(normalizeText('Œuf vibrant')).toBe('oeuf vibrant')
  })

  it('trims surrounding spaces', () => {
    expect(normalizeText('  wand  ')).toBe('wand')
  })
})
