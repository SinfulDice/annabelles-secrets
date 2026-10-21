import type { ImageCredit, Product } from './product'

export type ContentMode = 'sfw' | 'nsfw'

/**
 * What ProductImage needs. A favorite snapshot has only the thumbnail: it then always shows
 * the SFW image (nothing explicit is stored in favorites).
 */
export type ImageSubject = Pick<Product, 'id' | 'title' | 'type' | 'category' | 'thumbnail'> &
  Partial<Pick<Product, 'images' | 'nsfwImages' | 'nsfwImageCredits'>>

export type ImageSource = {
  src: string
  /** Shown blurred until « Afficher l'image » (R132). */
  isExplicit: boolean
  credit: ImageCredit | null
}
