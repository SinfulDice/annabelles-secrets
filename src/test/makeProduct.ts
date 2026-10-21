import type { Product } from '../types'

/** Builds a test product: only the fields a test cares about need to be given. */
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Produit test',
    description: 'Description de test assez longue.',
    category: 'femme',
    type: 'Vibromasseur wand',
    price: 50,
    discountPercentage: 0,
    rating: 4.5,
    stock: 10,
    availabilityStatus: 'In Stock',
    brand: "Annabelle's Secrets",
    sku: 'TEST-001',
    weight: 100,
    dimensions: { width: 1, height: 2, depth: 3 },
    material: 'Silicone',
    waterproof: false,
    batteryLife: null,
    noiseLevel: null,
    warrantyInformation: 'Garantie 2 ans',
    shippingInformation: 'Expédié sous 48 h',
    returnPolicy: 'Retour sous 30 jours',
    tags: [],
    thumbnail: 'https://example.com/thumb.png',
    images: [],
    nsfwImages: [],
    nsfwImageCredits: [],
    ...overrides,
  }
}
