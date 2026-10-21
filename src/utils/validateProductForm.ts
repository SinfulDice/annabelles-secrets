import { MAX_DISCOUNT_PERCENTAGE, MIN_DESCRIPTION_LENGTH } from '../constants/config'
import type { ProductFormErrors, ProductFormValues } from '../types'

const DECIMAL_NUMBER = /^\d+(\.\d+)?$/
const WHOLE_NUMBER = /^\d+$/

/** "49,90" or "49.90" → 49.9; anything else (letters, "4,9,0", "") → null. */
export function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(',', '.')
  return DECIMAL_NUMBER.test(normalized) ? Number(normalized) : null
}

/**
 * Checks every field and returns one French message per wrong field (R71).
 * An empty object means the form can be sent.
 */
export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {}

  if (values.title.trim() === '') errors.title = 'Saisissez le nom du produit.'
  if (values.type.trim() === '') {
    errors.type = 'Saisissez le type de produit, par exemple « Vibromasseur wand ».'
  }

  const price = parseDecimal(values.price)
  if (price === null || price <= 0) {
    errors.price = 'Saisissez un nombre supérieur à 0, par exemple 49,90.'
  }

  if (values.discountPercentage.trim() !== '') {
    const discount = parseDecimal(values.discountPercentage)
    if (discount === null || discount > MAX_DISCOUNT_PERCENTAGE) {
      errors.discountPercentage = `La remise doit être un nombre entre 0 et ${MAX_DISCOUNT_PERCENTAGE}.`
    }
  }

  if (!WHOLE_NUMBER.test(values.stock.trim())) {
    errors.stock = 'Le stock doit être un nombre entier, 0 ou plus.'
  }

  if (values.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `La description doit faire au moins ${MIN_DESCRIPTION_LENGTH} caractères.`
  }

  const imageUrl = values.imageUrl.trim()
  if (imageUrl !== '' && !imageUrl.startsWith('https://')) {
    errors.imageUrl = "L'adresse doit commencer par https://"
  }

  return errors
}
