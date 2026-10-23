import { Link } from 'react-router'
import { AdBanner } from '../components/ads/AdBanner'
import { CommitmentsBand } from '../components/home/CommitmentsBand'
import { HeroSection } from '../components/home/HeroSection'
import { NewsletterTeaser } from '../components/home/NewsletterTeaser'
import { ProductShowcase } from '../components/home/ProductShowcase'
import { UniverseTiles } from '../components/home/UniverseTiles'
import { HOME_GOODIES_COUNT, TOP_RATED_COUNT } from '../constants/home'
import { SHOP_PATH } from '../constants/navigation'
import { useCatalogSummary } from '../contexts/CatalogContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSelectCategory } from '../hooks/useSelectCategory'
import { DEFAULT_QUERY, productPagePath } from '../utils/productQuery'

const seeAllClasses = 'text-sm font-semibold text-femme underline underline-offset-4'

/** R82: the 4 best rated toys (goodies have their own row below), asked to the server. */
const TOP_RATED_PATH = productPagePath({
  ...DEFAULT_QUERY,
  categories: ['femme', 'homme'],
  pageSize: TOP_RATED_COUNT,
})
const GOODIES_PATH = productPagePath({
  ...DEFAULT_QUERY,
  categories: ['goodies'],
  pageSize: HOME_GOODIES_COUNT,
})

export function HomePage() {
  usePageTitle('Accueil')
  const catalog = useCatalogSummary()
  const selectCategory = useSelectCategory()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10 sm:py-14">
      <HeroSection productCount={catalog?.total ?? null} />
      <CommitmentsBand />
      <UniverseTiles catalog={catalog} />
      <AdBanner />
      <ProductShowcase
        id="top-rated-title"
        title="Les mieux notés"
        cardCount={TOP_RATED_COUNT}
        path={TOP_RATED_PATH}
        seeAllLink={
          <Link to={SHOP_PATH} onClick={() => selectCategory('all')} className={seeAllClasses}>
            Tout voir dans la boutique
          </Link>
        }
      />
      <ProductShowcase
        id="goodies-title"
        title="Les goodies de la maison"
        subtitle="Produits dérivés Annabelle's Secrets, à porter sans rougir."
        cardCount={HOME_GOODIES_COUNT}
        path={GOODIES_PATH}
        seeAllLink={
          <Link to={SHOP_PATH} onClick={() => selectCategory('goodies')} className={seeAllClasses}>
            Voir tous les goodies
          </Link>
        }
      />
      <NewsletterTeaser />
    </div>
  )
}
