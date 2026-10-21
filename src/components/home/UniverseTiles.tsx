import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import { UNIVERSE_TILES } from '../../constants/home'
import { SHOP_PATH } from '../../constants/navigation'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import type { Category, Product } from '../../types'
import { formatCount } from '../../utils/formatRating'
import { ArrowRightIcon } from '../ui/icons'

type UniverseTilesProps = {
  products: Product[]
}

export function UniverseTiles({ products }: UniverseTilesProps) {
  const selectCategory = useSelectCategory()
  const countIn = (category: Category) =>
    products.filter((product) => product.category === category).length

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
                  {products.length > 0 &&
                    ` · ${formatCount(countIn(category), 'produit', 'produits')}`}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1">
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
