import { Link, useParams } from 'react-router'
import { Breadcrumb } from '../components/products/Breadcrumb'
import { ProductGallery } from '../components/products/ProductGallery'
import { ProductReviews } from '../components/products/ProductReviews'
import { ProductsError } from '../components/products/ProductsError'
import { ProductSpecs } from '../components/products/ProductSpecs'
import { ProductSummary } from '../components/products/ProductSummary'
import { StickyFavoriteBar } from '../components/products/StickyFavoriteBar'
import { buttonClasses } from '../components/ui/buttonClasses'
import { PageLoading } from '../components/ui/PageLoading'
import { StateMessage } from '../components/ui/StateMessage'
import { SHOP_PATH } from '../constants/navigation'
import { useProductsContext } from '../contexts/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { ALL_REVIEWS } from '../services/reviews'
import { lookupProduct } from '../utils/lookupProduct'
import { getProductReviews } from '../utils/productReviews'

const pageClasses = 'mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10'

export function ProductDetailPage() {
  // useParams reads the ":id" part of the address /produits/:id.
  const { id } = useParams()
  const { state, retry } = useProductsContext()
  const lookup = lookupProduct(state, id)
  usePageTitle(lookup.status === 'found' ? lookup.product.title : 'Fiche produit')

  if (lookup.status === 'loading') return <PageLoading label="Chargement du produit…" />

  if (lookup.status === 'error') {
    return (
      <div className={pageClasses}>
        <ProductsError message={lookup.error} onRetry={retry} />
      </div>
    )
  }

  if (lookup.status === 'not-found') {
    return (
      <div className={pageClasses}>
        <StateMessage
          tone="empty"
          title="Produit introuvable"
          action={
            <Link to={SHOP_PATH} className={buttonClasses('primary')}>
              Voir la boutique
            </Link>
          }
        >
          <p>Ce produit n&apos;existe pas ou n&apos;est plus disponible.</p>
        </StateMessage>
      </div>
    )
  }

  const { product } = lookup
  const reviews = getProductReviews(product, ALL_REVIEWS)

  return (
    // Extra bottom space on mobile so the sticky bar never hides the last reviews.
    <div className={`${pageClasses} pb-28 md:pb-10`}>
      <Breadcrumb product={product} />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* key: another product resets the local state (selected image, star filter). */}
        <ProductGallery key={product.id} product={product} />
        <ProductSummary product={product} reviewCount={reviews.length} />
      </div>
      <ProductSpecs product={product} />
      <ProductReviews key={product.id} reviews={reviews} productRating={product.rating} />
      <StickyFavoriteBar product={product} />
    </div>
  )
}
