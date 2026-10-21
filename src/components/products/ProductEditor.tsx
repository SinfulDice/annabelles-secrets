import { Link } from 'react-router'
import { useEditProduct } from '../../hooks/useEditProduct'
import type { Product } from '../../types'
import { toFormValues } from '../../utils/productEdit'
import { DeleteProductButton } from './DeleteProductButton'
import { ProductForm } from './ProductForm'

/** The edit form of one product, with its success banner and the delete button. */
export function ProductEditor({ product }: { product: Product }) {
  const { state, submit } = useEditProduct(product)
  const productPath = `/produits/${product.id}`

  return (
    <div className="flex flex-col gap-5">
      {state.status === 'success' && (
        <p role="status" className="rounded-card bg-success-soft p-4 text-success">
          <strong>Modifications enregistrées.</strong> {state.summary}{' '}
          <Link to={productPath} className="font-semibold underline underline-offset-4">
            Voir la fiche
          </Link>
        </p>
      )}
      <div className="rounded-panel border border-line bg-surface p-5 sm:p-8">
        <ProductForm
          initialValues={toFormValues(product)}
          submitLabel="Enregistrer les modifications"
          isSubmitting={state.status === 'submitting'}
          submitError={state.status === 'error' ? state.message : null}
          onSubmit={(values) => void submit(values)}
          cancelPath={productPath}
          extraAction={<DeleteProductButton product={product} label="Supprimer le produit" />}
        />
      </div>
    </div>
  )
}
