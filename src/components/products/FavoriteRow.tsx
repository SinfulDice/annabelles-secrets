import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import type { FavoriteSnapshot } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { formatRating } from '../../utils/formatRating'
import { buttonClasses } from '../ui/buttonClasses'
import { CloseIcon } from '../ui/icons'
import { CATEGORY_STYLES } from './categoryStyles'
import { ProductImage } from './ProductImage'

type FavoriteRowProps = {
  favorite: FavoriteSnapshot
  onRemove: (id: number) => void
}

/** Built from the saved snapshot only, so it shows even when the API is down (R62). */
export function FavoriteRow({ favorite, onRemove }: FavoriteRowProps) {
  const styles = CATEGORY_STYLES[favorite.category]
  const productPath = `/produits/${favorite.id}`

  return (
    <article className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-surface p-3 sm:flex-nowrap sm:p-4">
      <div
        className={`size-20 shrink-0 overflow-hidden rounded-field sm:size-24 ${styles.imageBackground}`}
      >
        <ProductImage src={favorite.thumbnail} title={favorite.title} type={favorite.type} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.imageBackground} ${styles.badgeText}`}
        >
          {CATEGORY_LABELS[favorite.category]}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold">
          <Link to={productPath} className="underline underline-offset-4 hover:no-underline">
            {favorite.title}
          </Link>
        </h2>
        <p className="text-sm text-ink-muted">
          {favorite.type} · <span aria-hidden="true">★ </span>
          <span className="sr-only">note </span>
          {formatRating(favorite.rating)}
        </p>
      </div>

      <p className="font-display text-xl font-bold sm:px-6">{formatPrice(favorite.price)}</p>

      <div className="flex w-full gap-2 sm:w-auto">
        <Link
          to={productPath}
          aria-label={`Voir la fiche de ${favorite.title}`}
          className={`${buttonClasses('secondary')} flex-1 sm:flex-none`}
        >
          Voir la fiche
        </Link>
        <button
          type="button"
          onClick={() => onRemove(favorite.id)}
          aria-label={`Retirer ${favorite.title} des favoris`}
          className={`${buttonClasses('danger')} flex-1 sm:flex-none`}
        >
          <CloseIcon />
          Retirer
        </button>
      </div>
    </article>
  )
}
