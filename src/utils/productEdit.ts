import type { Product, ProductFormValues } from '../types'
import { availabilityFor, toProductPayload } from './createdProduct'
import { formatPrice } from './formatPrice'

/** 79 → "79,00" : numbers shown the French way in the edit form. */
const toFrenchNumber = (value: number) => String(value).replace('.', ',')

/** Prefills the edit form with the product (R110). */
export function toFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    category: product.category,
    type: product.type,
    brand: product.brand,
    price: toFrenchNumber(product.price),
    discountPercentage:
      product.discountPercentage > 0 ? toFrenchNumber(product.discountPercentage) : '',
    stock: String(product.stock),
    material: product.material,
    waterproof: product.waterproof,
    description: product.description,
    imageUrl: product.thumbnail,
  }
}

/**
 * The fields to change in the shop after a successful PUT. They come from what was SENT,
 * never from the answer: DummyJSON mixes in its own product with the same id (R110).
 */
export function toProductChanges(values: ProductFormValues, product: Product): Partial<Product> {
  const { thumbnail, images, ...fields } = toProductPayload(values)
  const imageChanged = thumbnail !== undefined && thumbnail !== product.thumbnail
  return {
    ...fields,
    availabilityStatus: availabilityFor(fields.stock),
    ...(imageChanged && { thumbnail, images }),
  }
}

/** « Prix passé à 79,00 €, stock à 30. » — what the success message says. */
export function describeChanges(before: Product, changes: Partial<Product>): string {
  const parts: string[] = []
  if (changes.title !== undefined && changes.title !== before.title) {
    parts.push(`nom changé en « ${changes.title} »`)
  }
  if (changes.price !== undefined && changes.price !== before.price) {
    parts.push(`prix passé à ${formatPrice(changes.price)}`)
  }
  if (changes.stock !== undefined && changes.stock !== before.stock) {
    parts.push(`stock à ${changes.stock}`)
  }
  if (parts.length === 0) return 'Aucun prix, nom ou stock modifié.'
  const sentence = parts.join(', ')
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`
}
