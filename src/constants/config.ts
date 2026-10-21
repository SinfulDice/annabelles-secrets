import type { Category, SortOption } from '../types'

export const SITE_NAME = "Annabelle's Secrets"
/** Where « Quitter » sends people who are under 18. */
export const AGE_GATE_EXIT_URL = 'https://www.google.fr'

export const PAGE_SIZE = 12
export const DEBOUNCE_MS = 300
export const TOAST_DURATION_MS = 4000

export const MIN_REVIEWS_PER_PRODUCT = 4
export const MAX_REVIEWS_PER_PRODUCT = 12
/** Chance that a review is one star below the rating drawn around the product rating. */
export const REVIEW_DIP_CHANCE = 0.12

export const API_URLS = {
  products: import.meta.env.VITE_PRODUCTS_URL,
  createProduct: 'https://dummyjson.com/products/add',
} as const

/** Product form rules (R71). */
export const MIN_DESCRIPTION_LENGTH = 20
export const MAX_DISCOUNT_PERCENTAGE = 90
/** A created product with this stock or less is shown as « Stock faible ». */
export const LOW_STOCK_MAX = 5

export const STORAGE_KEYS = {
  favorites: 'annabelle:favorites',
  ageConfirmed: 'annabelle:age-confirmed',
  accounts: 'annabelle:accounts',
  /** E-mail of the signed-in account, or null. */
  session: 'annabelle:session',
} as const

export const CATEGORY_LABELS: Record<Category, string> = {
  femme: 'Femme',
  homme: 'Homme',
  goodies: 'Goodies',
}

export const PRICE_OPTIONS = [30, 50, 80, 120] as const

export const SORT_LABELS: Record<SortOption, string> = {
  rating: 'Mieux notés',
  'price-asc': 'Prix croissant',
  'price-desc': 'Prix décroissant',
  newest: 'Nouveautés',
}
