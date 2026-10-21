import { useFavorites } from '../contexts/FavoritesContext'
import { useProductsContext } from '../contexts/ProductsContext'
import { AppProviders } from './providers'

// Temporary check of the contexts: replaced by the router in step 4.
function ContextsCheck() {
  const { state, retry } = useProductsContext()
  const { favorites, toggleFavorite } = useFavorites()

  if (state.status === 'error') {
    return (
      <p>
        {state.error}{' '}
        <button type="button" onClick={retry} className="underline">
          Réessayer
        </button>
      </p>
    )
  }
  if (state.status !== 'success') return <p role="status">Chargement des produits…</p>

  const firstProduct = state.products[0]
  return (
    <div className="space-y-2">
      <p>{state.products.length} produits chargés.</p>
      <p>{favorites.length} favori(s) enregistré(s).</p>
      {firstProduct && (
        <button
          type="button"
          onClick={() => toggleFavorite(firstProduct)}
          className="rounded-full bg-femme px-4 py-2 text-white"
        >
          Favori : {firstProduct.title}
        </button>
      )}
    </div>
  )
}

export function App() {
  return (
    <AppProviders>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-16">
        <h1 className="text-4xl font-bold">
          Annabelle&apos;s Secrets<span className="text-femme">.</span>
        </h1>
        <ContextsCheck />
      </main>
    </AppProviders>
  )
}
