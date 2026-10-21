import type { Category } from './product'

/** What the inputs hold: numbers stay text until validation ("49,90" is a valid price). */
export type ProductFormValues = {
  title: string
  category: Category
  type: string
  brand: string
  price: string
  discountPercentage: string
  stock: string
  material: string
  waterproof: boolean
  description: string
  imageUrl: string
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

/** The JSON body sent to POST /products/add. */
export type ProductPayload = {
  title: string
  category: Category
  type: string
  brand: string
  price: number
  discountPercentage: number
  stock: number
  material: string
  waterproof: boolean
  description: string
  thumbnail?: string
  images?: string[]
}

/** What DummyJSON answers: it only echoes the fields it knows (no type, material…). */
export type CreatedProductResponse = {
  id: number
  title: string
  price: number
  discountPercentage?: number
  stock: number
  description: string
  brand?: string
  category: string
  thumbnail?: string
  images?: string[]
}
