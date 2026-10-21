import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import { describeChanges, toFormValues, toProductChanges } from './productEdit'

const onde = makeProduct({
  id: 1,
  title: 'Onde Rosée',
  price: 89,
  discountPercentage: 10,
  stock: 3,
  thumbnail: 'https://example.com/onde.png',
})

describe('R110 the edit form is prefilled', () => {
  it('turns numbers into French text', () => {
    expect(toFormValues({ ...onde, price: 49.9 })).toMatchObject({
      title: 'Onde Rosée',
      price: '49,9',
      discountPercentage: '10',
      stock: '3',
      imageUrl: 'https://example.com/onde.png',
    })
  })

  it('shows no discount as an empty field', () => {
    expect(toFormValues({ ...onde, discountPercentage: 0 }).discountPercentage).toBe('')
  })
})

describe('R110 changes come from what was sent', () => {
  it('parses the form and recomputes the availability', () => {
    const changes = toProductChanges({ ...toFormValues(onde), price: '79,00', stock: '30' }, onde)
    expect(changes).toMatchObject({ price: 79, stock: 30, availabilityStatus: 'In Stock' })
  })

  it('keeps the images when the image address did not change', () => {
    const changes = toProductChanges(toFormValues(onde), onde)
    expect(changes).not.toHaveProperty('thumbnail')
  })

  it('replaces the images when a new address is given', () => {
    const values = { ...toFormValues(onde), imageUrl: 'https://example.com/new.png' }
    expect(toProductChanges(values, onde)).toMatchObject({
      thumbnail: 'https://example.com/new.png',
      images: ['https://example.com/new.png'],
    })
  })
})

describe('R110 success message', () => {
  it('lists the price and stock changes', () => {
    expect(describeChanges(onde, { price: 79, stock: 30 }).replace(/\s/g, ' ')).toBe(
      'Prix passé à 79,00 €, stock à 30.',
    )
  })

  it('says when nothing important changed', () => {
    expect(describeChanges(onde, { price: 89, description: 'Autre texte assez long.' })).toBe(
      'Aucun prix, nom ou stock modifié.',
    )
  })
})
