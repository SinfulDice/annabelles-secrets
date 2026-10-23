import type { RemoteData } from '../hooks/useRemoteData'
import type { Product } from '../types'
import {
  applySessionChanges,
  sessionCreatedProducts,
  type ProductMutations,
} from './productMutations'

export type ProductLookup =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | { status: 'found'; product: Product }

/** The id of a page address (/produits/:id), which can be anything: "abc", "-3", "2.5"… */
function parseProductId(rawId: string | undefined): number | null {
  return rawId !== undefined && /^\d+$/.test(rawId) ? Number(rawId) : null
}

function findCreated(id: number, mutations: ProductMutations): Product | undefined {
  return sessionCreatedProducts(mutations).find((product) => product.id === id)
}

/**
 * Address to ask the server for (R53), or null when it is not needed: invalid id, product
 * deleted in this session, or created in this session (the server doesn't know it, R77).
 */
export function productPath(rawId: string | undefined, mutations: ProductMutations) {
  const id = parseProductId(rawId)
  if (id === null || mutations.deletedIds.includes(id) || findCreated(id, mutations)) return null
  return `/api/products/${id}`
}

/** What the product page (and the edit page) must show, from the URL and the server answer. */
export function lookupProduct(
  rawId: string | undefined,
  remote: RemoteData<Product>,
  mutations: ProductMutations,
): ProductLookup {
  const id = parseProductId(rawId)
  if (id === null || mutations.deletedIds.includes(id)) return { status: 'not-found' }

  const created = findCreated(id, mutations)
  if (created) return { status: 'found', product: created }

  if (remote.status === 'loading') return { status: 'loading' }
  if (remote.status === 'error') {
    // 404 from our API = unknown id: that is « Produit introuvable », not a failure.
    return remote.httpStatus === 404
      ? { status: 'not-found' }
      : { status: 'error', error: remote.error }
  }
  const [product] = applySessionChanges([remote.data], mutations)
  return product ? { status: 'found', product } : { status: 'not-found' }
}
