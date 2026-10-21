import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { formatRating } from '../../utils/formatRating'
import { CATEGORY_STYLES } from './categoryStyles'
import { FavoriteButton } from './FavoriteButton'
import { ProductImage } from './ProductImage'

type ProductCardProps = {
  product: Product
  priority?: boolean
}

/**
 * The title link is stretched over the whole card (after:absolute after:inset-0), so the
 * card is clickable while keeping ONE link per card for keyboard and screen reader users.
 */
export function ProductCard({ product, priority }: ProductCardProps) {
  const styles = CATEGORY_STYLES[product.category]

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-2.5 transition-shadow focus-within:shadow-md hover:shadow-md">
      <div
        className={`relative aspect-square overflow-hidden rounded-field ${styles.imageBackground}`}
      >
        <ProductImage
          src={product.thumbnail}
          title={product.title}
          type={product.type}
          priority={priority}
        />
        <span
          className={`absolute bottom-2 left-2 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold sm:top-2 sm:bottom-auto ${styles.badgeText}`}
        >
          {CATEGORY_LABELS[product.category]}
        </span>
        <div className="absolute top-2 right-2">
          <FavoriteButton product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pb-1">
        <p className="text-xs text-ink-muted">{product.type}</p>
        <h3 className="font-display text-base leading-tight font-bold">
          <Link to={`/produits/${product.id}`} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-1">
          <p className="font-bold">{formatPrice(product.price)}</p>
          <p className="text-xs text-ink-muted">
            <span aria-hidden="true">★ </span>
            <span className="sr-only">Note : </span>
            {formatRating(product.rating)}
          </p>
        </div>
      </div>
    </article>
  )
}
