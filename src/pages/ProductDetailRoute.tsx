import { lazy, Suspense } from 'react'
import { PageLoading } from '../components/ui/PageLoading'

/**
 * Code splitting: the product page (with its 500 reviews, ~180 kB) is a separate file,
 * downloaded the first time someone opens a product. Without it the app is one file of
 * more than 500 kB. Suspense shows a message while that file arrives.
 */
const ProductDetailPage = lazy(async () => {
  const module = await import('./ProductDetailPage')
  return { default: module.ProductDetailPage }
})

export function ProductDetailRoute() {
  return (
    <Suspense fallback={<PageLoading label="Chargement du produit…" />}>
      <ProductDetailPage />
    </Suspense>
  )
}
