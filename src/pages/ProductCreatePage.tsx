import { CreatedProductSummary } from '../components/products/CreatedProductSummary'
import { ProductForm } from '../components/products/ProductForm'
import { useCreateProduct } from '../hooks/useCreateProduct'
import { usePageTitle } from '../hooks/usePageTitle'
import type { ProductFormValues } from '../types'

const EMPTY_FORM: ProductFormValues = {
  title: '',
  category: 'femme',
  type: '',
  brand: '',
  price: '',
  discountPercentage: '',
  stock: '',
  material: '',
  waterproof: false,
  description: '',
  imageUrl: '',
}

export function ProductCreatePage() {
  usePageTitle('Ajouter un produit')
  const { state, submit, reset } = useCreateProduct()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-4xl font-bold sm:text-5xl">Ajouter un produit</h1>
        <p className="mt-2 text-ink-muted">
          Les champs marqués <span className="text-danger">*</span> sont obligatoires.
        </p>
      </header>

      {state.status === 'success' ? (
        <CreatedProductSummary
          response={state.response}
          productId={state.productId}
          onCreateAnother={reset}
        />
      ) : (
        <div className="rounded-panel border border-line bg-surface p-5 sm:p-8">
          <ProductForm
            initialValues={EMPTY_FORM}
            submitLabel="Créer le produit"
            isSubmitting={state.status === 'submitting'}
            submitError={state.status === 'error' ? state.message : null}
            onSubmit={(values) => void submit(values)}
            cancelPath="/produits"
          />
        </div>
      )}
    </div>
  )
}
