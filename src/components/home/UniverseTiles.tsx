import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import { UNIVERSE_TILES } from '../../constants/home'
import { SHOP_PATH } from '../../constants/navigation'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import type { CatalogSummary } from '../../types'
import { formatCount } from '../../utils/formatRating'
import { ArrowRightIcon } from '../ui/icons'

type UniverseTilesProps = {
  /** null while /api/catalog is loading: the tiles are shown without their counts. */
  catalog: CatalogSummary | null
}

export function UniverseTiles({ catalog }: UniverseTilesProps) {
  const selectCategory = useSelectCategory()

  return (
    <section aria-labelledby="universes-title" className="flex flex-col gap-5">
      <h2 id="universes-title" className="text-3xl font-bold">
        Explorer par univers
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {UNIVERSE_TILES.map(({ category, description, classes }) => (
          <li key={category}>
            <Link
              to={SHOP_PATH}
              onClick={() => selectCategory(category)}
              className={`group flex min-h-44 flex-col justify-end gap-2 rounded-panel p-6 ${classes}`}
            >
              <span className="font-display text-3xl font-bold">{CATEGORY_LABELS[category]}</span>
              <span className="flex items-end justify-between gap-4 text-sm opacity-90">
                <span>
                  {description}
                  {catalog &&
                    ` · ${formatCount(catalog.categories[category].count, 'produit', 'produits')}`}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-page text-ink transition-transform group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
