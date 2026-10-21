import { CATEGORY_LABELS } from '../constants/config'
import type { FavoriteSnapshot, Product } from '../types'

export function toFavoriteSnapshot(product: Product): FavoriteSnapshot {
  const { id, title, type, category, price, rating, thumbnail } = product
  return { id, title, type, category, price, rating, thumbnail }
}

/** Adding an item that is already saved changes nothing (R60). */
export function addFavorite(
  favorites: FavoriteSnapshot[],
  snapshot: FavoriteSnapshot,
): FavoriteSnapshot[] {
  if (favorites.some((favorite) => favorite.id === snapshot.id)) return favorites
  return [...favorites, snapshot]
}

export function removeFavorite(favorites: FavoriteSnapshot[], id: number): FavoriteSnapshot[] {
  return favorites.filter((favorite) => favorite.id !== id)
}

function isFavoriteSnapshot(value: unknown): value is FavoriteSnapshot {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.type === 'string' &&
    typeof item.category === 'string' &&
    item.category in CATEGORY_LABELS &&
    typeof item.price === 'number' &&
    typeof item.rating === 'number' &&
    typeof item.thumbnail === 'string'
  )
}

/**
 * Turns what was read from localStorage into a clean list (R61): anything that is not a
 * valid favorite is dropped, and duplicated ids are kept only once.
 */
export function parseFavorites(stored: unknown): FavoriteSnapshot[] {
  if (!Array.isArray(stored)) return []
  return stored.filter(isFavoriteSnapshot).reduce<FavoriteSnapshot[]>(addFavorite, [])
}
