import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { useProducts, type ProductsState } from '../hooks/useProducts'
import type { Product } from '../types'
import {
  applyMutations,
  initialMutations,
  productMutationsReducer,
} from '../utils/productMutations'

type ProductsContextValue = {
  /** Loaded products with this session's creations, edits and deletions applied. */
  state: ProductsState
  retry: () => void
  addProduct: (product: Product) => void
  updateProduct: (id: number, changes: Partial<Product>) => void
  removeProduct: (id: number) => void
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { state: loadState, retry } = useProducts()
  // A reducer for the 3 kinds of changes (created / updated / deleted), tested on its own.
  const [mutations, dispatch] = useReducer(productMutationsReducer, initialMutations)

  const addProduct = useCallback((product: Product) => dispatch({ type: 'created', product }), [])
  const updateProduct = useCallback(
    (id: number, changes: Partial<Product>) => dispatch({ type: 'updated', id, changes }),
    [],
  )
  const removeProduct = useCallback((id: number) => dispatch({ type: 'deleted', id }), [])

  // useMemo: without it, a new object would be created on every render and every component
  // reading this context would re-render, even when nothing changed.
  const value = useMemo<ProductsContextValue>(() => {
    const state: ProductsState =
      loadState.status === 'success'
        ? { status: 'success', products: applyMutations(loadState.products, mutations) }
        : loadState
    return { state, retry, addProduct, updateProduct, removeProduct }
  }, [loadState, mutations, retry, addProduct, updateProduct, removeProduct])

  return <ProductsContext value={value}>{children}</ProductsContext>
}

export function useProductsContext(): ProductsContextValue {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProductsContext doit être utilisé dans <ProductsProvider>.')
  }
  return context
}
