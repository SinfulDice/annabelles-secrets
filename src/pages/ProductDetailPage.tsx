import { usePageTitle } from '../hooks/usePageTitle'

// Temporary page: built in step 6.
export function ProductDetailPage() {
  usePageTitle('Fiche produit')
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Fiche produit</h1>
    </div>
  )
}
