import { describe, expect, it } from 'vitest'
import type { ProductsState } from '../hooks/useProducts'
import { makeProduct } from '../test/makeProduct'
import { lookupProduct } from './lookupProduct'

const onde = makeProduct({ id: 21 })
const loaded: ProductsState = { status: 'success', products: [onde] }

describe('R53 product page states', () => {
  it('is loading while the list is loading (direct access to the URL)', () => {
    expect(lookupProduct({ status: 'idle' }, '21')).toEqual({ status: 'loading' })
    expect(lookupProduct({ status: 'loading' }, '21')).toEqual({ status: 'loading' })
  })

  it('passes the loading error on', () => {
    expect(lookupProduct({ status: 'error', error: 'Erreur 500' }, '21')).toEqual({
      status: 'error',
      error: 'Erreur 500',
    })
  })

  it('finds the product of the URL', () => {
    expect(lookupProduct(loaded, '21')).toEqual({ status: 'found', product: onde })
  })

  it.each(['999', 'abc', '2.5', '', undefined])('is "not found" for the id %j', (rawId) => {
    expect(lookupProduct(loaded, rawId)).toEqual({ status: 'not-found' })
  })
})
