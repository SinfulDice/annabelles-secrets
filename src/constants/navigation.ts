import type { CategoryFilter } from '../types'

export const SHOP_PATH = '/produits'

export const SHOP_LINKS: { label: string; category: CategoryFilter }[] = [
  { label: 'Boutique', category: 'all' },
  { label: 'Femme', category: 'femme' },
  { label: 'Homme', category: 'homme' },
  { label: 'Goodies', category: 'goodies' },
]
