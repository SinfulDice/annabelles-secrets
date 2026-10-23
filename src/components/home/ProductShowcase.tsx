import type { ReactNode } from 'react'
import { useSessionProducts } from '../../contexts/SessionProductsContext'
import { useRemoteData } from '../../hooks/useRemoteData'
import type { ProductPage } from '../../types'
import { applySessionChanges } from '../../utils/productMutations'
import { ProductGrid } from '../products/ProductGrid'
import { ProductsError } from '../products/ProductsError'
import { ProductsLoading } from '../products/ProductsLoading'

type ProductShowcaseProps = {
  id: string
  title: string
  subtitle?: string
  /** Link shown next to the title (« Tout voir dans la boutique »…). */
  seeAllLink: ReactNode
  /** The products to show: an address of our API, e.g. `/api/products?category=goodies`. */
  path: string
  /** Grey cards shown while loading: as many as the row will have. */
  cardCount: number
}

/** A titled row of product cards on the home page, with its own loading and error states. */
export function ProductShowcase(props: ProductShowcaseProps) {
  const { id, title, subtitle, seeAllLink, path, cardCount } = props
  const { state, retry } = useRemoteData<ProductPage>(path)
  const { mutations } = useSessionProducts()

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
      {state.status === 'loading' && <ProductsLoading cardCount={cardCount} />}
      {state.status === 'success' && (
        <ProductGrid products={applySessionChanges(state.data.products, mutations)} />
      )}
    </section>
  )
}
