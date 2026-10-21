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

/** The list the shop shows: loaded + created, minus deleted, with the edits applied. */
export function applyMutations(loaded: Product[], mutations: ProductMutations): Product[] {
  const deleted = new Set(mutations.deletedIds)
  return [...loaded, ...mutations.created]
    .filter((product) => !deleted.has(product.id))
    .map((product) => {
      const changes = mutations.updated[product.id]
      return changes ? { ...product, ...changes } : product
    })
}
