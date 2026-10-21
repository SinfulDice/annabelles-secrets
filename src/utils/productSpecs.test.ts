import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import { getProductSpecs } from './productSpecs'

const labels = (product: ReturnType<typeof makeProduct>) =>
  getProductSpecs(product).map((spec) => spec.label)

const valueOf = (product: ReturnType<typeof makeProduct>, label: string) =>
  getProductSpecs(product).find((spec) => spec.label === label)?.value

describe('R50 product characteristics', () => {
  const toy = makeProduct({
    material: 'Silicone de grade médical',
    dimensions: { width: 5.2, height: 11.5, depth: 4 },
    weight: 120,
    waterproof: true,
    batteryLife: 120,
    noiseLevel: 40,
  })

  it('lists material, dimensions, weight, waterproofing, battery, noise, warranty, shipping, return', () => {
    expect(labels(toy)).toEqual([
      'Matériau',
      'Dimensions',
      'Poids',
      'Étanchéité',
      'Autonomie',
      'Niveau sonore',
      'Garantie',
      'Expédition',
      'Retour',
    ])
  })

  it('writes numbers the French way', () => {
    expect(valueOf(toy, 'Dimensions')).toBe('11,5 × 5,2 × 4 cm')
    expect(valueOf(toy, 'Poids')).toBe('120 g')
    expect(valueOf(toy, 'Étanchéité')).toBe('Étanche')
  })
})

describe('R52 fields that do not apply are hidden', () => {
  it('no battery life or noise level when they are null', () => {
    const product = makeProduct({ batteryLife: null, noiseLevel: null })
    expect(labels(product)).not.toContain('Autonomie')
    expect(labels(product)).not.toContain('Niveau sonore')
  })

  it('R79 hides unknown material, dimensions and weight of a created product', () => {
    const created = makeProduct({
      material: '',
      weight: 0,
      dimensions: { width: 0, height: 0, depth: 0 },
    })
    expect(labels(created)).not.toContain('Matériau')
    expect(labels(created)).not.toContain('Dimensions')
    expect(labels(created)).not.toContain('Poids')
    expect(labels(created)).toContain('Étanchéité')
  })

  it('shows the sizes only when the product has some', () => {
    expect(labels(makeProduct())).not.toContain('Tailles disponibles')
    expect(labels(makeProduct({ sizes: null }))).not.toContain('Tailles disponibles')
    expect(valueOf(makeProduct({ sizes: ['S', 'M', 'L'] }), 'Tailles disponibles')).toBe('S, M, L')
  })
})
