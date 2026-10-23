import type { Product } from '../types'

/**
 * Changes made in this browser on top of the loaded list. DummyJSON only simulates writes,
 * so we keep them here (lost on reload, as the course allows).
 */
export type ProductMutations = {
  created: Product[]
  /** Changed fields per product id. */
  updated: Record<number, Partial<Product>>
  deletedIds: number[]
}

export type ProductMutationAction =
  | { type: 'created'; product: Product }
  | { type: 'updated'; id: number; changes: Partial<Product> }
  | { type: 'deleted'; id: number }

export const initialMutations: ProductMutations = { created: [], updated: {}, deletedIds: [] }

export function productMutationsReducer(
  state: ProductMutations,
  action: ProductMutationAction,
): ProductMutations {
  switch (action.type) {
    case 'created':
      return { ...state, created: [...state.created, { ...action.product, isLocal: true }] }
    case 'updated':
      return {
        ...state,
        updated: {
          ...state.updated,
          [action.id]: { ...state.updated[action.id], ...action.changes },
        },
      }
    case 'deleted':
      return { ...state, deletedIds: [...state.deletedIds, action.id] }
  }
}

/**
 * Products received from the server, as this browser must show them (R114): deleted ones
 * hidden, edits applied. The page may then show one card less: the server doesn't know.
 */
export function applySessionChanges(products: Product[], mutations: ProductMutations): Product[] {
  const deleted = new Set(mutations.deletedIds)
  return products
    .filter((product) => !deleted.has(product.id))
    .map((product) => {
      const changes = mutations.updated[product.id]
      return changes ? { ...product, ...changes } : product
    })
}

/** The products created in this session (R77), with their own later edits and deletions. */
export function sessionCreatedProducts(mutations: ProductMutations): Product[] {
  return applySessionChanges(mutations.created, mutations)
}
