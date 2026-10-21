import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import { SHOP_PATH } from '../../constants/navigation'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import type { Product } from '../../types'
import { ArrowLeftIcon } from '../ui/icons'

type BreadcrumbProps = {
  product: Product
}

const crumbLink = 'text-femme underline underline-offset-4 hover:no-underline'

/**
 * « Retour aux résultats » goes back to /produits without touching the filters: they live
 * in the context, so the previous search and page are still there (R29, R50).
 */
export function Breadcrumb({ product }: BreadcrumbProps) {
  const selectCategory = useSelectCategory()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link
        to={SHOP_PATH}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold hover:border-ink-muted"
      >
        <ArrowLeftIcon />
        Retour aux résultats
      </Link>
      <nav aria-label="Fil d'Ariane" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to={SHOP_PATH} onClick={() => selectCategory('all')} className={crumbLink}>
              Boutique
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to={SHOP_PATH}
              onClick={() => selectCategory(product.category)}
              className={crumbLink}
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>
    </div>
  )
}
