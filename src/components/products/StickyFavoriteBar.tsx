import type { Product } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { FavoriteToggle } from './FavoriteToggle'

type StickyFavoriteBarProps = {
  product: Product
}

/** Mobile only (mockup 14): price and favorite button always within thumb's reach. */
export function StickyFavoriteBar({ product }: StickyFavoriteBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-surface px-4 py-3 md:hidden">
      <p className="flex flex-col text-xs text-ink-muted">
        Prix
        <strong className="text-lg text-ink">{formatPrice(product.price)}</strong>
      </p>
      <FavoriteToggle product={product} className="flex-1" />
    </div>
  )
}
