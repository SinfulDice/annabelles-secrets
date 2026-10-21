import type { ReactNode } from 'react'
import { useProductsContext } from '../../contexts/ProductsContext'
import type { Product } from '../../types'
import { ProductGrid } from '../products/ProductGrid'
import { ProductsError } from '../products/ProductsError'
import { ProductsLoading } from '../products/ProductsLoading'

type ProductShowcaseProps = {
  id: string
  title: string
  subtitle?: string
  /** Link shown next to the title (« Tout voir dans la boutique »…). */
  seeAllLink: ReactNode
  /** Chooses which loaded products to show. */
  pickProducts: (products: Product[]) => Product[]
  columns: 4 | 5
}

/** A titled row of product cards on the home page, with its own loading and error states. */
export function ProductShowcase(props: ProductShowcaseProps) {
  const { id, title, subtitle, seeAllLink, pickProducts, columns } = props
  const { state, retry } = useProductsContext()

  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id={id} className="text-3xl font-bold">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-muted">{subtitle}</p>}
        </div>
        {seeAllLink}
      </div>
      {state.status === 'error' && <ProductsError message={state.error} onRetry={retry} />}
      {(state.status === 'idle' || state.status === 'loading') && (
        <ProductsLoading cardCount={columns} />
      )}
      {state.status === 'success' && (
        <ProductGrid products={pickProducts(state.products)} columns={columns} />
      )}
    </section>
  )
}
