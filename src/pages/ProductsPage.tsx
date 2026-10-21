import { usePageTitle } from '../hooks/usePageTitle'

// Temporary page: built in step 5.
export function ProductsPage() {
  usePageTitle('Boutique')
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Boutique</h1>
    </div>
  )
}
