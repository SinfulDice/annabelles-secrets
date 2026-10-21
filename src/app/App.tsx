import { formatPrice } from '../utils/formatPrice'

// Temporary page: replaced by the router in step 4.
export function App() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">
        Annabelle&apos;s Secrets<span className="text-femme">.</span>
      </h1>
      <p className="mt-4 text-ink-muted">Outillage prêt. Exemple de prix : {formatPrice(89)}</p>
    </main>
  )
}
