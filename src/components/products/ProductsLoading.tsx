import { Spinner } from '../ui/Spinner'

type ProductsLoadingProps = {
  cardCount: number
}

const SKELETON_BLOCK = 'rounded-full bg-line/70'

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-2.5">
      <div className="aspect-square animate-pulse rounded-field bg-line/70" />
      <div className={`h-3 w-1/2 ${SKELETON_BLOCK}`} />
      <div className={`h-4 w-3/4 ${SKELETON_BLOCK}`} />
      <div className="flex justify-between">
        <div className={`h-4 w-1/4 ${SKELETON_BLOCK}`} />
        <div className={`h-4 w-1/6 ${SKELETON_BLOCK}`} />
      </div>
    </div>
  )
}

/** Grey cards shaped like the real ones, so the page doesn't jump when data arrives (R41). */
export function ProductsLoading({ cardCount }: ProductsLoadingProps) {
  // Index keys are fine here: the placeholders are identical and never reordered.
  const placeholders = Array.from({ length: cardCount }, (_, index) => index)

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="flex items-center gap-2 font-semibold text-femme">
        <Spinner />
        <span className="text-ink">Chargement des produits…</span>
      </p>
      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
      >
        {placeholders.map((placeholder) => (
          <ProductCardSkeleton key={placeholder} />
        ))}
      </div>
    </div>
  )
}
