import type { RefObject } from 'react'
import type { ProductFormErrors, ProductFormValues } from '../../types'

/** Short names used in the summary sentence: « 3 champs à corriger : prix, description… ». */
const FIELD_NAMES: Record<keyof ProductFormValues, string> = {
  title: 'nom',
  category: 'catégorie',
  type: 'type',
  brand: 'marque',
  price: 'prix',
  discountPercentage: 'remise',
  stock: 'stock',
  material: 'matériau',
  waterproof: 'étanchéité',
  description: 'description',
  imageUrl: 'image',
}

type FormErrorSummaryProps = {
  errors: ProductFormErrors
  /** Receives the focus after a failed submit, so screen readers read it at once (R72). */
  summaryRef: RefObject<HTMLDivElement | null>
  fieldId: (field: keyof ProductFormValues) => string
}

export function FormErrorSummary({ errors, summaryRef, fieldId }: FormErrorSummaryProps) {
  const fields = Object.keys(errors) as (keyof ProductFormValues)[]
  if (fields.length === 0) return null

  return (
    <div
      ref={summaryRef}
      role="alert"
      tabIndex={-1}
      className="rounded-field bg-danger-soft p-4 text-sm font-semibold text-danger"
    >
      <span aria-hidden="true">! </span>
      {fields.length} {fields.length > 1 ? 'champs à corriger' : 'champ à corriger'} avant
      l&apos;envoi :{' '}
      {fields.map((field, index) => (
        <span key={field}>
          {index > 0 && ', '}
          {/* Each name is a link that jumps to its field. */}
          <a href={`#${fieldId(field)}`} className="underline underline-offset-2">
            {FIELD_NAMES[field]}
          </a>
        </span>
      ))}
      .
    </div>
  )
}
