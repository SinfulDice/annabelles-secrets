export type Category = 'femme' | 'homme' | 'goodies'

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'

export type Dimensions = {
  width: number
  height: number
  depth: number
}

export type ImageCredit = {
  photographer: string
  page: string
}

export type Product = {
  id: number
  title: string
  description: string
  category: Category
  type: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  availabilityStatus: AvailabilityStatus
  brand: string
  sku: string
  /** Grams. */
  weight: number
  /** Centimetres. */
  dimensions: Dimensions
  material: string
  waterproof: boolean
  /** Minutes, null when the product has no battery. */
  batteryLife: number | null
  /** Decibels, null when the product makes no noise. */
  noiseLevel: number | null
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  tags: string[]
  thumbnail: string
  images: string[]
  nsfwImages: string[]
  nsfwImageCredits: ImageCredit[]
  /** Only some goodies (clothes) have sizes. */
  sizes?: string[] | null
  /** Created in this browser: unknown to DummyJSON, so PUT/DELETE stay local. */
  isLocal?: boolean
}

export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
