import type { ProductsState } from '../hooks/useProducts'
import type { Product } from '../types'

export type ProductLookup =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | { status: 'found'; product: Product }

/**
 * Finds the product of a page address (/produits/:id) in the loaded list.
 * The id comes from the URL, so it can be anything: "abc", "-3", "999"… (R53).
 */
export function lookupProduct(state: ProductsState, rawId: string | undefined): ProductLookup {
  if (state.status === 'idle' || state.status === 'loading') return { status: 'loading' }
  if (state.status === 'error') return { status: 'error', error: state.error }

  const id = Number(rawId)
  const product = Number.isInteger(id) ? state.products.find((item) => item.id === id) : undefined
  return product ? { status: 'found', product } : { status: 'not-found' }
}
