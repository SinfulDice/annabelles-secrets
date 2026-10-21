import { useFavorites } from '../../contexts/FavoritesContext'
import type { Product } from '../../types'
import { HeartIcon } from '../ui/icons'

type FavoriteButtonProps = {
  product: Product
}

/** Round heart button on cards. aria-pressed tells screen readers whether it is "on". */
export function FavoriteButton({ product }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isSaved = isFavorite(product.id)

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(product)}
      aria-pressed={isSaved}
      aria-label={`Favori : ${product.title}`}
      className="relative z-10 grid size-11 place-items-center rounded-full bg-surface text-femme shadow-sm hover:scale-105"
    >
      <HeartIcon filled={isSaved} />
    </button>
  )
}
