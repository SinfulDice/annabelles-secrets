import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CATEGORY_LABELS, MIN_DESCRIPTION_LENGTH } from '../../constants/config'
import type { Category, ProductFormValues } from '../../types'
import { validateProductForm } from '../../utils/validateProductForm'
import { buttonClasses } from '../ui/buttonClasses'
import { Checkbox } from '../ui/Checkbox'
import { SegmentedControl } from '../ui/SegmentedControl'
import { Spinner } from '../ui/Spinner'
import { TextField } from '../ui/TextField'
import { FormErrorSummary } from './FormErrorSummary'

type ProductFormProps = {
  initialValues: ProductFormValues
  submitLabel: string
  isSubmitting: boolean
  /** Message of the last failed request, or null. */
  submitError: string | null
  onSubmit: (values: ProductFormValues) => void
  /** Where « Annuler » goes. */
  cancelPath: string
  /** Extra button at the end of the action row (e.g. « Supprimer le produit »). */
  extraAction?: ReactNode
}

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as Category[]).map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}))

const fieldId = (field: keyof ProductFormValues) => `product-${field}`

/** Shared by creation and (later) edition: same fields, same checks (R70–R75). */
export function ProductForm(props: ProductFormProps) {
  const { initialValues, submitLabel, isSubmitting, submitError, onSubmit, cancelPath } = props
  // Controlled form: React state is the single source of truth for every field.
  const [values, setValues] = useState(initialValues)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)

  // Errors are computed during render: once a submit has failed, they update as the user types.
  const errors = failedAttempts > 0 ? validateProductForm(values) : {}

  // After each failed submit, move the focus to the summary (it exists only after the render).
  useEffect(() => {
    if (failedAttempts > 0) summaryRef.current?.focus()
  }, [failedAttempts])

  function update<Field extends keyof ProductFormValues>(
    field: Field,
    value: ProductFormValues[Field],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (isSubmitting) return
    if (Object.keys(validateProductForm(values)).length > 0) {
      setFailedAttempts((count) => count + 1)
      return
    }
    onSubmit(values)
  }

  // Shortcut for the text fields: same id scheme, value, error and update for each one.
  const textProps = (field: Exclude<keyof ProductFormValues, 'category' | 'waterproof'>) => ({
    id: fieldId(field),
    value: values[field],
    error: errors[field],
    onChange: (value: string) => update(field, value),
  })

  return (
    // noValidate: our own checks and messages replace the browser's bubbles.
    <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      {/* A disabled fieldset locks every field and button inside it during the request (R74). */}
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5">
        <FormErrorSummary errors={errors} summaryRef={summaryRef} fieldId={fieldId} />

        <TextField {...textProps('title')} label="Nom du produit" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <SegmentedControl
            legend="Catégorie"
            name="product-category"
            value={values.category}
            options={CATEGORY_OPTIONS}
            onChange={(category) => update('category', category)}
            required
          />
          <TextField {...textProps('type')} label="Type" required />
          <TextField {...textProps('brand')} label="Marque" />
          <TextField {...textProps('price')} label="Prix (€)" required inputMode="decimal" />
          <TextField
            {...textProps('discountPercentage')}
            label="Remise (%)"
            hint="Entre 0 et 90."
            inputMode="decimal"
          />
          <TextField {...textProps('stock')} label="Stock" required inputMode="numeric" />
          <TextField {...textProps('material')} label="Matériau" />
          <div className="sm:self-end">
            <Checkbox
              id={fieldId('waterproof')}
              label="Étanche (IPX7)"
              checked={values.waterproof}
              onChange={(waterproof) => update('waterproof', waterproof)}
            />
          </div>
        </div>
        <TextField
          {...textProps('description')}
          label="Description"
          required
          multiline
          counter={`${values.description.trim().length} / ${MIN_DESCRIPTION_LENGTH}`}
        />
        <TextField
          {...textProps('imageUrl')}
          label="URL de l'image"
          hint="Facultatif. Sans image, une vignette aux couleurs de la catégorie est créée."
          inputMode="url"
        />

        {submitError && (
          <div role="alert" className="rounded-card border border-danger/40 bg-danger-soft p-4">
            <p className="font-bold text-danger">L&apos;envoi a échoué. {submitError}</p>
            <p className="mt-1 text-sm">
              Vos saisies sont conservées : vous pouvez réessayer sans rien retaper.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-line pt-5">
          <button type="submit" className={buttonClasses('primary')}>
            {isSubmitting && <Spinner />}
            {isSubmitting && 'Envoi en cours…'}
            {!isSubmitting && (submitError ? "Réessayer l'envoi" : submitLabel)}
          </button>
          <Link to={cancelPath} className={buttonClasses('secondary')}>
            Annuler
          </Link>
          {props.extraAction && <div className="sm:ml-auto">{props.extraAction}</div>}
        </div>
      </fieldset>
    </form>
  )
}
