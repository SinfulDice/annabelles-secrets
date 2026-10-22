import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
}

/** Above this index, images are below the fold and can load lazily. */
const EAGER_IMAGES = 4

/** The number of columns follows the available width (grid-cards in index.css, R83). */
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cards gap-3 sm:gap-5">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < EAGER_IMAGES} />
        </li>
      ))}
    </ul>
  )
}
