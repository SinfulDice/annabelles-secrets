import { useFavorites } from '../../contexts/FavoritesContext'
import type { Product } from '../../types'
import { buttonClasses } from '../ui/buttonClasses'
import { HeartIcon } from '../ui/icons'

type FavoriteToggleProps = {
  product: Product
  className?: string
}

/** The wide favorite button of the product page; its text says what a click will do. */
export function FavoriteToggle({ product, className = '' }: FavoriteToggleProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isSaved = isFavorite(product.id)

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(product)}
      className={`${buttonClasses('primary')} ${className}`}
    >
      <HeartIcon filled={isSaved} />
      {isSaved ? 'Dans vos favoris — Retirer' : 'Ajouter aux favoris'}
    </button>
  )
}
