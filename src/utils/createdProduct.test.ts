import { describe, expect, it } from 'vitest'
import { makeFormValues } from '../test/makeFormValues'
import type { CreatedProductResponse } from '../types'
import { buildCreatedProduct, firstFreeId, toProductPayload } from './createdProduct'

describe('R73 the form becomes a JSON body', () => {
  it('turns texts into numbers and trims spaces', () => {
    const payload = toProductPayload(makeFormValues({ title: '  Écume ', price: '49,90' }))
    expect(payload).toMatchObject({
      title: 'Écume',
      price: 49.9,
      discountPercentage: 10,
      stock: 15,
      thumbnail: 'https://example.com/ecume.png',
      images: ['https://example.com/ecume.png'],
    })
  })

  it('an empty discount becomes 0 and an empty image is not sent', () => {
    const payload = toProductPayload(makeFormValues({ discountPercentage: '', imageUrl: '' }))
    expect(payload.discountPercentage).toBe(0)
    expect(payload).not.toHaveProperty('thumbnail')
  })
})

describe('R78 a created product always gets its own id', () => {
  it('keeps the id from the API when it is free', () => {
    expect(firstFreeId(195, [1, 2, 45])).toBe(195)
  })

  it('takes the next free id when DummyJSON repeats 195', () => {
    expect(firstFreeId(195, [1, 195, 196])).toBe(197)
  })
})

describe('R77 R78 R79 building the created product', () => {
  const payload = toProductPayload(makeFormValues())
  // What DummyJSON really answers: no type, material or waterproof.
  const response: CreatedProductResponse = {
    id: 195,
    title: 'Écume',
    price: 49.9,
    discountPercentage: 10,
    stock: 15,
    description: 'Doux, discret et entièrement étanche.',
    brand: "Annabelle's Secrets",
    category: 'femme',
    thumbnail: 'https://example.com/ecume.png',
  }

  it('uses the API answer and completes it with the form values', () => {
    const product = buildCreatedProduct(response, payload, [1, 195])
    expect(product).toMatchObject({
      id: 196,
      title: 'Écume',
      price: 49.9,
      type: 'Stimulateur à ondes',
      material: 'Silicone de grade médical',
      waterproof: true,
      isLocal: true,
      availabilityStatus: 'In Stock',
    })
  })

  it('has no rating yet (R79)', () => {
    expect(buildCreatedProduct(response, payload, []).rating).toBe(0)
  })

  it('gets a placeholder image when none was given', () => {
    const product = buildCreatedProduct({ ...response, thumbnail: undefined }, payload, [])
    expect(product.thumbnail).toContain('dummyjson.com/image/600x600/F3E3E8/8A2846?text=%C3%89cume')
  })

  it.each([
    [0, 'Out of Stock'],
    [3, 'Low Stock'],
    [15, 'In Stock'],
  ])('a stock of %i is shown as %s', (stock, status) => {
    expect(buildCreatedProduct({ ...response, stock }, payload, []).availabilityStatus).toBe(status)
  })
})
