import { CATEGORY_LABELS } from '../../constants/config'
import type { AvailabilityStatus, Product } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { formatCount, formatRating } from '../../utils/formatRating'
import { getOriginalPrice } from '../../utils/originalPrice'
import { CATEGORY_STYLES } from './categoryStyles'
import { FavoriteToggle } from './FavoriteToggle'

type ProductSummaryProps = {
  product: Product
  reviewCount: number
}

const AVAILABILITY: Record<AvailabilityStatus, { label: string; classes: string }> = {
  'In Stock': { label: 'En stock', classes: 'text-success' },
  'Low Stock': { label: 'Stock faible', classes: 'text-warning-ink' },
  'Out of Stock': { label: 'Rupture de stock', classes: 'text-danger' },
}

/** Name, price, availability, description and the favorite button (R50, R51). */
export function ProductSummary({ product, reviewCount }: ProductSummaryProps) {
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage)
  const availability = AVAILABILITY[product.availabilityStatus]
  const styles = CATEGORY_STYLES[product.category]

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-2 text-sm font-semibold">
        <li className={`rounded-full px-3 py-1 ${styles.imageBackground} ${styles.badgeText}`}>
          {CATEGORY_LABELS[product.category]}
        </li>
        <li className="rounded-full border border-line bg-surface px-3 py-1">{product.type}</li>
      </ul>

      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">{product.title}</h1>
        <p className="mt-2 text-ink-muted">
          par <strong className="text-ink">{product.brand}</strong> · Réf. {product.sku}
        </p>
        <p className="mt-2 text-sm">
          <span aria-hidden="true">★ </span>
          <span className="sr-only">Note : </span>
          <strong>{formatRating(product.rating)}</strong> ·{' '}
          <a href="#avis" className="text-femme underline underline-offset-4">
            {formatCount(reviewCount, 'avis', 'avis')}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="font-display text-4xl font-bold">{formatPrice(product.price)}</p>
        {originalPrice !== null && (
          <>
            <p className="text-ink-muted line-through">
              <span className="sr-only">Prix d&apos;origine : </span>
              {formatPrice(originalPrice)}
            </p>
            <p className="rounded-full bg-ink px-2.5 py-1 text-sm font-semibold text-white">
              −{product.discountPercentage} %
            </p>
          </>
        )}
      </div>

      <p className={`flex items-center gap-2 font-semibold ${availability.classes}`}>
        <span aria-hidden="true" className="size-2.5 rounded-full bg-current" />
        {availability.label}
        {product.stock > 0 && ` · ${formatCount(product.stock, 'unité', 'unités')}`}
      </p>

      <p className="text-lg leading-relaxed">{product.description}</p>

      {/* On mobile the favorite button lives in the sticky bar at the bottom instead. */}
      <div className="hidden md:block">
        <FavoriteToggle product={product} className="w-full" />
      </div>

      <div className="rounded-card border border-line bg-surface p-4 text-sm">
        <p>{product.shippingInformation}</p>
        <p className="mt-1 text-ink-muted">
          {product.warrantyInformation} · {product.returnPolicy}
        </p>
      </div>
    </div>
  )
}
