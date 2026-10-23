import { describe, expect, it } from 'vitest'
import type { RemoteData } from '../hooks/useRemoteData'
import { makeProduct } from '../test/makeProduct'
import type { Product } from '../types'
import { lookupProduct, productPath } from './lookupProduct'
import { initialMutations, productMutationsReducer } from './productMutations'

const onde = makeProduct({ id: 21, title: 'Onde Rosée' })
const ecume = makeProduct({ id: 195, title: 'Écume' })
const loaded: RemoteData<Product> = { status: 'success', data: onde }
const loading: RemoteData<Product> = { status: 'loading', previous: null }
const none = initialMutations

describe('R53 product page states', () => {
  it('asks the server for the product of the URL (direct access works)', () => {
    expect(productPath('21', none)).toBe('/api/products/21')
    expect(lookupProduct('21', loading, none)).toEqual({ status: 'loading' })
    expect(lookupProduct('21', loaded, none)).toEqual({ status: 'found', product: onde })
  })

  it('a 404 from the API means « Produit introuvable »', () => {
    const notFound: RemoteData<Product> = { status: 'error', error: '404', httpStatus: 404 }
    expect(lookupProduct('999', notFound, none)).toEqual({ status: 'not-found' })
  })

  it('another failure is an error, with a retry', () => {
    const failed: RemoteData<Product> = { status: 'error', error: 'Erreur 500', httpStatus: 500 }
    expect(lookupProduct('21', failed, none)).toEqual({ status: 'error', error: 'Erreur 500' })
  })

  it.each(['abc', '-3', '2.5', '', undefined])('an invalid id %j is never sent', (rawId) => {
    expect(productPath(rawId, none)).toBeNull()
    expect(lookupProduct(rawId, loading, none)).toEqual({ status: 'not-found' })
  })
})

describe('R77 R112 R114 products changed in this session', () => {
  it('a product created here is found without asking the server', () => {
    const mutations = productMutationsReducer(none, { type: 'created', product: ecume })
    expect(productPath('195', mutations)).toBeNull()
    expect(lookupProduct('195', loading, mutations)).toEqual({
      status: 'found',
      product: { ...ecume, isLocal: true },
    })
  })

  it('a product deleted here is « introuvable », edits are applied', () => {
    const deleted = productMutationsReducer(none, { type: 'deleted', id: 21 })
    expect(productPath('21', deleted)).toBeNull()
    expect(lookupProduct('21', loaded, deleted)).toEqual({ status: 'not-found' })

    const edited = productMutationsReducer(none, { type: 'updated', id: 21, changes: { price: 9 } })
    expect(lookupProduct('21', loaded, edited)).toEqual({
      status: 'found',
      product: { ...onde, price: 9 },
    })
  })
})
