import { Link } from 'react-router'
import { AdBanner } from '../components/ads/AdBanner'
import { CommitmentsBand } from '../components/home/CommitmentsBand'
import { HeroSection } from '../components/home/HeroSection'
import { ProductShowcase } from '../components/home/ProductShowcase'
import { UniverseTiles } from '../components/home/UniverseTiles'
import { TOP_RATED_COUNT } from '../constants/home'
import { SHOP_PATH } from '../constants/navigation'
import { useProductsContext } from '../contexts/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSelectCategory } from '../hooks/useSelectCategory'
import type { Product } from '../types'
import { sortProducts } from '../utils/filterProducts'

const seeAllClasses = 'text-sm font-semibold text-femme underline underline-offset-4'

/** The 4 best rated toys (goodies have their own row below). */
function pickTopRated(products: Product[]): Product[] {
  const toys = products.filter((product) => product.category !== 'goodies')
  return sortProducts(toys, 'rating').slice(0, TOP_RATED_COUNT)
}

function pickGoodies(products: Product[]): Product[] {
  return products.filter((product) => product.category === 'goodies')
}

export function HomePage() {
  usePageTitle('Accueil')
  const { state } = useProductsContext()
  const selectCategory = useSelectCategory()
  const products = state.status === 'success' ? state.products : []

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10 sm:py-14">
      <HeroSection productCount={state.status === 'success' ? products.length : null} />
      <CommitmentsBand />
      <UniverseTiles products={products} />
      <AdBanner />
      <ProductShowcase
        id="top-rated-title"
        title="Les mieux notés"
        columns={4}
        pickProducts={pickTopRated}
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
        columns={5}
        pickProducts={pickGoodies}
        seeAllLink={
          <Link to={SHOP_PATH} onClick={() => selectCategory('goodies')} className={seeAllClasses}>
            Voir tous les goodies
          </Link>
        }
      />
    </div>
  )
}
