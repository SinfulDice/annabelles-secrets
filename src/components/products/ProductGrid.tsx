import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  /** Columns on large screens; always 2 on mobile (R83). */
  columns?: 4 | 5
}

const columnClasses = { 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }

/** Above this index, images are below the fold and can load lazily. */
const EAGER_IMAGES = 4

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 ${columnClasses[columns]}`}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < EAGER_IMAGES} />
        </li>
      ))}
    </ul>
  )
}
