import { Link, useLocation } from 'react-router'
import { SHOP_LINKS, SHOP_PATH } from '../../constants/navigation'
import { useFilters } from '../../contexts/FiltersContext'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import type { CategoryFilter } from '../../types'

const PRODUCT_PAGE_PATH = /^\/produits\/\d+$/

type MainNavProps = {
  direction: 'row' | 'column'
  /** Lets the mobile menu close itself when a link is chosen. */
  onNavigate?: () => void
}

const linkBase = 'rounded-full px-4 py-2.5 text-sm font-medium transition-colors'
const activeClasses = 'bg-femme-soft text-femme'
const idleClasses = 'text-ink hover:bg-page'

export function MainNav({ direction, onNavigate }: MainNavProps) {
  const { pathname } = useLocation()
  const { filters } = useFilters()
  const selectCategory = useSelectCategory()

  // The list page highlights its category; a product page highlights « Boutique ».
  function isActive(category: CategoryFilter): boolean {
    if (pathname === SHOP_PATH) return filters.category === category
    return category === 'all' && PRODUCT_PAGE_PATH.test(pathname)
  }

  const linkClasses = (active: boolean) => `${linkBase} ${active ? activeClasses : idleClasses}`
  const isHome = pathname === '/'

  return (
    <nav aria-label="Navigation principale">
      <ul className={direction === 'row' ? 'flex items-center gap-1' : 'flex flex-col gap-1'}>
        <li>
          <Link
            to="/"
            onClick={onNavigate}
            aria-current={isHome ? 'page' : undefined}
            className={`block ${linkClasses(isHome)}`}
          >
            Accueil
          </Link>
        </li>
        {SHOP_LINKS.map(({ label, category }) => (
          <li key={category}>
            <Link
              to={SHOP_PATH}
              onClick={() => {
                selectCategory(category)
                onNavigate?.()
              }}
              aria-current={isActive(category) ? 'page' : undefined}
              className={`block ${linkClasses(isActive(category))}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
