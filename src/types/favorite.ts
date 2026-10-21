import type { Product } from './product'

/** What is saved in localStorage: enough to show the favorites page without the API (R62). */
export type FavoriteSnapshot = Pick<
  Product,
  'id' | 'title' | 'type' | 'category' | 'price' | 'rating' | 'thumbnail'
>
