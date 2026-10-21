import { usePageTitle } from '../hooks/usePageTitle'

// Temporary page: built in step 8.
export function ProductCreatePage() {
  usePageTitle('Ajouter un produit')
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Ajouter un produit</h1>
    </div>
  )
}
