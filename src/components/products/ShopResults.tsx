import type { Product } from '../../types'
import { getActiveFilters } from '../../utils/activeFilters'
import { useFilters } from '../../contexts/FiltersContext'
import { formatCount } from '../../utils/formatRating'
import type { Page } from '../../utils/paginate'
import { buttonClasses } from '../ui/buttonClasses'
import { StateMessage } from '../ui/StateMessage'
import { Pagination } from './Pagination'
import { ProductGrid } from './ProductGrid'

type ShopResultsProps = {
  resultCount: number
  page: Page<Product>
  onPageChange: (page: number) => void
  onReset: () => void
}

export function ShopResults({ resultCount, page, onPageChange, onReset }: ShopResultsProps) {
  const { filters } = useFilters()
  const criteriaSummary = getActiveFilters(filters)
    .map((filter) => filter.label)
    .join(' · ')

  return (
    <section aria-labelledby="results-title" className="flex flex-col gap-5">
      <h2 id="results-title" className="sr-only">
        Résultats
      </h2>
      {/* aria-live: screen readers hear the new count after each search or filter (R33). */}
      <p aria-live="polite" className="text-sm">
        <strong>{formatCount(resultCount, 'résultat', 'résultats')}</strong>
        <span className="text-ink-muted">
          {' '}
          · Page {page.currentPage} sur {page.totalPages}
        </span>
      </p>

      {resultCount === 0 ? (
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
          <ProductGrid products={page.pageItems} />
          {page.totalPages > 1 && (
            <Pagination
              currentPage={page.currentPage}
              totalPages={page.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </section>
  )
}
