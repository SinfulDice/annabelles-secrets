import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import {
  applySessionChanges,
  initialMutations,
  productMutationsReducer,
  sessionCreatedProducts,
  type ProductMutationAction,
} from './productMutations'

const onde = makeProduct({ id: 1, title: 'Onde Rosée', price: 89 })
const orbite = makeProduct({ id: 2, title: 'Orbite', price: 34.9 })
const ecume = makeProduct({ id: 195, title: 'Écume' })

const mutationsAfter = (...actions: ProductMutationAction[]) =>
  actions.reduce(productMutationsReducer, initialMutations)
/** A page received from the server, as the shop shows it after these actions. */
const serverPage = (...actions: ProductMutationAction[]) =>
  applySessionChanges([onde, orbite], mutationsAfter(...actions))

describe('R110 R111 R114 changes made in this browser, applied to the pages of the server', () => {
  it('without changes, the page is shown as received', () => {
    expect(serverPage()).toEqual([onde, orbite])
  })

  it('an edit changes only the given fields', () => {
    const [first] = serverPage({ type: 'updated', id: 1, changes: { price: 79, stock: 30 } })
    expect(first).toEqual({ ...onde, price: 79, stock: 30 })
  })

  it('two edits of the same product add up', () => {
    const [first] = serverPage(
      { type: 'updated', id: 1, changes: { price: 79 } },
      { type: 'updated', id: 1, changes: { stock: 30 } },
    )
    expect(first).toMatchObject({ price: 79, stock: 30 })
  })

  it('a deleted product is hidden from the page', () => {
    expect(serverPage({ type: 'deleted', id: 1 })).toEqual([orbite])
  })

  it('R77 a created product is NOT mixed into the pages of the server', () => {
    expect(serverPage({ type: 'created', product: ecume })).toEqual([onde, orbite])
  })
})

describe('R77 R112 products created in this session', () => {
  const created: ProductMutationAction = { type: 'created', product: ecume }

  it('are listed apart, marked as local', () => {
    expect(sessionCreatedProducts(mutationsAfter(created))).toEqual([{ ...ecume, isLocal: true }])
  })

  it('can be edited and deleted too', () => {
    const edited = sessionCreatedProducts(
      mutationsAfter(created, { type: 'updated', id: 195, changes: { title: 'Écume 2' } }),
    )
    expect(edited[0]?.title).toBe('Écume 2')
    expect(sessionCreatedProducts(mutationsAfter(created, { type: 'deleted', id: 195 }))).toEqual(
      [],
    )
  })
})
