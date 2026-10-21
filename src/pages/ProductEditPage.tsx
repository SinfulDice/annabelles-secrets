import { Link, useParams } from 'react-router'
import { ProductEditor } from '../components/products/ProductEditor'
import { ProductsError } from '../components/products/ProductsError'
import { buttonClasses } from '../components/ui/buttonClasses'
import { PageLoading } from '../components/ui/PageLoading'
import { StateMessage } from '../components/ui/StateMessage'
import { SHOP_PATH } from '../constants/navigation'
import { useProductsContext } from '../contexts/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { lookupProduct } from '../utils/lookupProduct'

const pageClasses = 'mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12'

/** /produits/:id/modifier — admin only (guarded by RequireAdmin in the router). */
export function ProductEditPage() {
  const { id } = useParams()
  const { state, retry } = useProductsContext()
  const lookup = lookupProduct(state, id)
  usePageTitle(
    lookup.status === 'found' ? `Modifier ${lookup.product.title}` : 'Modifier un produit',
  )

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
          <p>Ce produit n&apos;existe pas ou a été supprimé.</p>
        </StateMessage>
      </div>
    )
  }

  const { product } = lookup
  return (
    <div className={pageClasses}>
      <header className="flex flex-col gap-2">
        <Link
          to={`/produits/${product.id}`}
          className="self-start text-sm font-semibold text-femme underline underline-offset-4"
        >
          ← Retour à la fiche
        </Link>
        <h1 className="text-4xl font-bold sm:text-5xl">Modifier « {product.title} »</h1>
        <p className="text-ink-muted">
          Formulaire prérempli · enregistré avec PUT, supprimé avec DELETE.
        </p>
      </header>
      {/* key: another product gets a fresh form and a fresh success message. */}
      <ProductEditor key={product.id} product={product} />
    </div>
  )
}
