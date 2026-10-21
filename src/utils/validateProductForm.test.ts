import { describe, expect, it } from 'vitest'
import { makeFormValues } from '../test/makeFormValues'
import { parseDecimal, validateProductForm } from './validateProductForm'

const errorsFor = (overrides: Parameters<typeof makeFormValues>[0]) =>
  validateProductForm(makeFormValues(overrides))

describe('R71 product form validation', () => {
  it('a complete form has no error', () => {
    expect(errorsFor({})).toEqual({})
  })

  it('optional fields may stay empty', () => {
    expect(errorsFor({ brand: '', discountPercentage: '', material: '', imageUrl: '' })).toEqual({})
  })

  it('requires the name and the type', () => {
    expect(errorsFor({ title: '  ', type: '' })).toEqual({
      title: 'Saisissez le nom du produit.',
      type: 'Saisissez le type de produit, par exemple « Vibromasseur wand ».',
    })
  })

  it.each(['', 'quarante', '0', '-5', '4,9,0'])('refuses the price %j', (price) => {
    expect(errorsFor({ price }).price).toBe('Saisissez un nombre supérieur à 0, par exemple 49,90.')
  })

  it.each(['49,90', '49.90', '12'])('accepts the price %j (comma or dot)', (price) => {
    expect(errorsFor({ price }).price).toBeUndefined()
  })

  it.each(['0', '90', '12,5'])('accepts the discount %j', (discountPercentage) => {
    expect(errorsFor({ discountPercentage }).discountPercentage).toBeUndefined()
  })

  it.each(['91', '-1', 'dix'])('refuses the discount %j', (discountPercentage) => {
    expect(errorsFor({ discountPercentage }).discountPercentage).toBe(
      'La remise doit être un nombre entre 0 et 90.',
    )
  })

  it.each(['', '2.5', '-1', 'beaucoup'])('refuses the stock %j', (stock) => {
    expect(errorsFor({ stock }).stock).toBe('Le stock doit être un nombre entier, 0 ou plus.')
  })

  it('accepts a stock of 0', () => {
    expect(errorsFor({ stock: '0' }).stock).toBeUndefined()
  })

  it('needs at least 20 characters of description (spaces around do not count)', () => {
    expect(errorsFor({ description: '   Doux et discret.   ' }).description).toBe(
      'La description doit faire au moins 20 caractères.',
    )
    expect(errorsFor({ description: 'Exactement vingt car' }).description).toBeUndefined()
  })

  it('wants an image address starting with https://', () => {
    expect(errorsFor({ imageUrl: 'www.monimage.fr/ecume.png' }).imageUrl).toBe(
      "L'adresse doit commencer par https://",
    )
    expect(errorsFor({ imageUrl: 'http://monimage.fr/ecume.png' }).imageUrl).toBeDefined()
  })
})

describe('R71 parseDecimal', () => {
  it('reads French and English decimals', () => {
    expect(parseDecimal('49,90')).toBe(49.9)
    expect(parseDecimal(' 49.90 ')).toBe(49.9)
  })

  it('returns null for anything that is not a plain number', () => {
    expect(parseDecimal('')).toBeNull()
    expect(parseDecimal('1e3')).toBeNull()
    expect(parseDecimal('12 €')).toBeNull()
  })
})
