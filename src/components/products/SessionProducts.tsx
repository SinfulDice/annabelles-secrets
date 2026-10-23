import type { Product } from '../../types'
import { ProductGrid } from './ProductGrid'

type SessionProductsProps = {
  products: Product[]
}

/**
 * R77: products created in this session. The server doesn't know them, so they can't be
 * inside its pages: they get their own block, above the results, until the page is reloaded.
 */
export function SessionProducts({ products }: SessionProductsProps) {
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="session-products-title"
      className="flex flex-col gap-4 rounded-panel border border-dashed border-femme/50 p-4 sm:p-6"
    >
      <div>
        <h2 id="session-products-title" className="text-2xl font-bold">
          Ajoutés pendant cette session
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Simulés avec DummyJSON : ils disparaîtront au rechargement de la page.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
