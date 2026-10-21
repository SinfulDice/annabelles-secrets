import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import {
  applyMutations,
  initialMutations,
  productMutationsReducer,
  type ProductMutationAction,
} from './productMutations'

const onde = makeProduct({ id: 1, title: 'Onde Rosée', price: 89 })
const orbite = makeProduct({ id: 2, title: 'Orbite', price: 34.9 })
const ecume = makeProduct({ id: 195, title: 'Écume' })

const run = (...actions: ProductMutationAction[]) =>
  applyMutations([onde, orbite], actions.reduce(productMutationsReducer, initialMutations))

describe('R77 R110 R111 changes made in this browser', () => {
  it('without changes, the loaded list is shown as is', () => {
    expect(run()).toEqual([onde, orbite])
  })

  it('a created product is added at the end, marked as local', () => {
    expect(run({ type: 'created', product: ecume }).at(-1)).toEqual({ ...ecume, isLocal: true })
  })

  it('an edit changes only the given fields', () => {
    const [first] = run({ type: 'updated', id: 1, changes: { price: 79, stock: 30 } })
    expect(first).toEqual({ ...onde, price: 79, stock: 30 })
  })

  it('two edits of the same product add up', () => {
    const [first] = run(
      { type: 'updated', id: 1, changes: { price: 79 } },
      { type: 'updated', id: 1, changes: { stock: 30 } },
    )
    expect(first).toMatchObject({ price: 79, stock: 30 })
  })

  it('a deleted product disappears from the shop', () => {
    expect(run({ type: 'deleted', id: 1 })).toEqual([orbite])
  })

  it('R112 a created product can be edited and deleted too', () => {
    const edited = run(
      { type: 'created', product: ecume },
      { type: 'updated', id: 195, changes: { title: 'Écume 2' } },
    )
    expect(edited.at(-1)?.title).toBe('Écume 2')
    expect(run({ type: 'created', product: ecume }, { type: 'deleted', id: 195 })).toEqual([
      onde,
      orbite,
    ])
  })
})
