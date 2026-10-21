import type { Product } from '../../types'
import { getProductSpecs } from '../../utils/productSpecs'

type ProductSpecsProps = {
  product: Product
}

/** A description list (<dl>): the right HTML for "label: value" pairs. */
export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <section
      aria-labelledby="specs-title"
      className="rounded-panel border border-line bg-surface p-5 sm:p-8"
    >
      <h2 id="specs-title" className="text-2xl font-bold">
        Caractéristiques
      </h2>
      <dl className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {getProductSpecs(product).map((spec) => (
          <div
            key={spec.label}
            className="flex justify-between gap-4 border-b border-line py-3 text-sm"
          >
            <dt className="text-ink-muted">{spec.label}</dt>
            <dd className="text-right font-semibold">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
