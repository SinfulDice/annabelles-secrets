import { useFilters } from '../../contexts/FiltersContext'
import type { ProductPage } from '../../types'
import { getActiveFilters } from '../../utils/activeFilters'
import { formatCount } from '../../utils/formatRating'
import { buttonClasses } from '../ui/buttonClasses'
import { Spinner } from '../ui/Spinner'
import { StateMessage } from '../ui/StateMessage'
import { Pagination } from './Pagination'
import { ProductGrid } from './ProductGrid'

type ShopResultsProps = {
  /** The page sent by the server, with this session's edits and deletions applied. */
  page: ProductPage
  /** true while the next page is on its way: the current one stays, greyed out (R41). */
  isUpdating: boolean
  onPageChange: (page: number) => void
  onReset: () => void
}

export function ShopResults({ page, isUpdating, onPageChange, onReset }: ShopResultsProps) {
  const { filters } = useFilters()
  const criteriaSummary = getActiveFilters(filters)
    .map((filter) => filter.label)
    .join(' · ')

  return (
    <section aria-labelledby="results-title" className="flex flex-col gap-5">
      <h2 id="results-title" className="sr-only">
        Résultats
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* aria-live: screen readers hear the new count after each search or filter (R33). */}
        <p aria-live="polite" className="text-sm">
          <strong>{formatCount(page.total, 'résultat', 'résultats')}</strong>
          <span className="text-ink-muted">
            {' '}
            · Page {page.page} sur {page.totalPages}
          </span>
        </p>
        {isUpdating && (
          <p role="status" className="flex items-center gap-2 text-sm font-semibold text-femme">
            <Spinner />
            <span className="text-ink">Mise à jour…</span>
          </p>
        )}
      </div>

      {/* aria-busy: assistive technologies know this part is about to change. */}
      <div
        aria-busy={isUpdating}
        className={`flex flex-col gap-5 transition-opacity ${isUpdating ? 'pointer-events-none opacity-50' : ''}`}
      >
        {page.total === 0 ? (
          <StateMessage
            tone="empty"
            title="Aucun produit ne correspond"
            action={
              <button type="button" onClick={onReset} className={buttonClasses('secondary')}>
                Réinitialiser les filtres
              </button>
            }
          >
            <p>Rien pour {criteriaSummary}. Essayez un autre mot ou élargissez les filtres.</p>
          </StateMessage>
        ) : (
          <>
            <ProductGrid products={page.products} />
            {page.totalPages > 1 && (
              <Pagination
                currentPage={page.page}
                totalPages={page.totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}
