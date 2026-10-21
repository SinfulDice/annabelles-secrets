import { usePageTitle } from '../hooks/usePageTitle'

// Temporary page: built in step 7.
export function FavoritesPage() {
  usePageTitle('Favoris')
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Mes favoris</h1>
    </div>
  )
}
