import type { ProductFormValues } from '../types'

/** A valid form: each test breaks only the field it is about. */
export function makeFormValues(overrides: Partial<ProductFormValues> = {}): ProductFormValues {
  return {
    title: 'Écume',
    category: 'femme',
    type: 'Stimulateur à ondes',
    brand: "Annabelle's Secrets",
    price: '49,90',
    discountPercentage: '10',
    stock: '15',
    material: 'Silicone de grade médical',
    waterproof: true,
    description: 'Doux, discret et entièrement étanche.',
    imageUrl: 'https://example.com/ecume.png',
    ...overrides,
  }
}
