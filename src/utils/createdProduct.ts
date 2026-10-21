import { LOW_STOCK_MAX } from '../constants/config'
import type {
  AvailabilityStatus,
  CreatedProductResponse,
  Product,
  ProductFormValues,
  ProductPayload,
} from '../types'
import { parseDecimal } from './validateProductForm'

const NOT_PROVIDED = 'Non renseignée'

/** Same placeholder style as the catalogue images, in the colours of the category. */
const PLACEHOLDER_COLORS = {
  femme: 'F3E3E8/8A2846',
  homme: 'E1E9F2/24476B',
  goodies: 'EDE6DC/5C4A38',
} as const

/** Form text → JSON body. Only called on a valid form, so the numbers parse. */
export function toProductPayload(values: ProductFormValues): ProductPayload {
  const imageUrl = values.imageUrl.trim()
  return {
    title: values.title.trim(),
    category: values.category,
    type: values.type.trim(),
    brand: values.brand.trim(),
    price: parseDecimal(values.price) ?? 0,
    discountPercentage: parseDecimal(values.discountPercentage) ?? 0,
    stock: Number(values.stock.trim()),
    material: values.material.trim(),
    waterproof: values.waterproof,
    description: values.description.trim(),
    ...(imageUrl !== '' && { thumbnail: imageUrl, images: [imageUrl] }),
  }
}

/**
 * DummyJSON answers id 195 to every creation (R78): keep it when it is free, otherwise
 * take the next free number, so two created products never share an address.
 */
export function firstFreeId(wantedId: number, usedIds: number[]): number {
  const used = new Set(usedIds)
  let id = wantedId
  while (used.has(id)) id += 1
  return id
}

export function availabilityFor(stock: number): AvailabilityStatus {
  if (stock === 0) return 'Out of Stock'
  return stock <= LOW_STOCK_MAX ? 'Low Stock' : 'In Stock'
}

/**
 * Turns the API answer into a full Product for the shop (R77, R78): the answer gives the id,
 * name, price, stock…; the fields DummyJSON drops (type, material, waterproof) come from
 * what was sent; the rest is unknown and stays empty (R79).
 */
export function buildCreatedProduct(
  response: CreatedProductResponse,
  payload: ProductPayload,
  usedIds: number[],
): Product {
  const id = firstFreeId(response.id, usedIds)
  const placeholder = `https://dummyjson.com/image/600x600/${PLACEHOLDER_COLORS[payload.category]}?text=${encodeURIComponent(payload.title)}&fontSize=36`
  const image = response.thumbnail ?? placeholder

  return {
    id,
    title: response.title,
    description: response.description,
    category: payload.category,
    type: payload.type,
    price: response.price,
    discountPercentage: response.discountPercentage ?? 0,
    rating: 0,
    stock: response.stock,
    availabilityStatus: availabilityFor(response.stock),
    brand: response.brand ?? payload.brand,
    sku: `LOCAL-${id}`,
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    material: payload.material,
    waterproof: payload.waterproof,
    batteryLife: null,
    noiseLevel: null,
    warrantyInformation: NOT_PROVIDED,
    shippingInformation: NOT_PROVIDED,
    returnPolicy: NOT_PROVIDED,
    tags: [],
    thumbnail: image,
    images: [image],
    nsfwImages: [image],
    nsfwImageCredits: [],
    isLocal: true,
  }
}
