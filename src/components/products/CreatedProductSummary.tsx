import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { CATEGORY_LABELS } from '../../constants/config'
import type { Category, CreatedProductResponse } from '../../types'
import { formatPrice } from '../../utils/formatPrice'
import { buttonClasses } from '../ui/buttonClasses'

type CreatedProductSummaryProps = {
  response: CreatedProductResponse
  /** Address of the product in the shop (may differ from response.id, see R78). */
  productId: number
  onCreateAnother: () => void
}

function categoryLabel(category: string): string {
  return category in CATEGORY_LABELS ? CATEGORY_LABELS[category as Category] : category
}

/** Success: everything shown here comes from the API answer, id included (R76). */
export function CreatedProductSummary(props: CreatedProductSummaryProps) {
  const { response, productId, onCreateAnother } = props
  const titleRef = useRef<HTMLHeadingElement>(null)

  // The form disappears: put the focus on the confirmation so it is read out loud.
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const rows = [
    { label: 'Identifiant', value: String(response.id) },
    { label: 'Nom', value: response.title },
    { label: 'Catégorie', value: categoryLabel(response.category) },
    { label: 'Prix', value: formatPrice(response.price) },
    { label: 'Remise', value: `${response.discountPercentage ?? 0} %` },
    { label: 'Stock', value: String(response.stock) },
    { label: 'Marque', value: response.brand || '—' },
  ]

  return (
    <section className="flex flex-col gap-4 rounded-panel border border-success/40 bg-surface p-6 sm:p-8">
      <h2
        ref={titleRef}
        tabIndex={-1}
        className="flex items-center gap-2 text-2xl font-bold text-success outline-none"
      >
        <span aria-hidden="true">✓</span> Produit créé avec succès
      </h2>
      <p className="text-sm text-ink-muted">Réponse de l&apos;API :</p>
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-line py-2.5">
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="text-right font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
      {productId !== response.id && (
        <p className="text-sm text-ink-muted">
          DummyJSON renvoie toujours l&apos;identifiant {response.id} : dans la boutique, ce produit
          a reçu le numéro {productId}.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link to={`/produits/${productId}`} className={buttonClasses('primary')}>
          Voir la fiche
        </Link>
        <button type="button" onClick={onCreateAnother} className={buttonClasses('secondary')}>
          Créer un autre produit
        </button>
      </div>
    </section>
  )
}
