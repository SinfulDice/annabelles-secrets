import { PAGE_SIZE } from '../../constants/config'
import { ArrowLeftIcon, ArrowRightIcon } from '../ui/icons'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const pageButton =
  'grid min-h-11 min-w-11 place-items-center rounded-full border text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40'

/** Précédent / numéros / Suivant, plus « Page X sur Y » (R27). Numbers are hidden on mobile. */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${pageButton} gap-2 border-line bg-surface px-4`}
        >
          <span className="flex items-center gap-2">
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Précédent</span>
            <span className="sr-only sm:hidden">Page précédente</span>
          </span>
        </button>

        <ul className="hidden items-center gap-2 sm:flex">
          {pages.map((page) => {
            const isCurrent = page === currentPage
            return (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                  className={`${pageButton} ${isCurrent ? 'border-ink bg-ink text-on-accent' : 'border-line bg-surface'}`}
                >
                  {page}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="font-semibold sm:hidden">
          Page {currentPage} sur {totalPages}
        </p>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${pageButton} border-line bg-surface px-4`}
        >
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">Suivant</span>
            <span className="sr-only sm:hidden">Page suivante</span>
            <ArrowRightIcon />
          </span>
        </button>
      </div>
      <p className="hidden text-sm text-ink-muted sm:block">
        Page {currentPage} sur {totalPages} · {PAGE_SIZE} produits par page
      </p>
    </nav>
  )
}
