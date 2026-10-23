import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { Product } from '../types'
import {
  initialMutations,
  productMutationsReducer,
  type ProductMutations,
} from '../utils/productMutations'

type SessionProductsContextValue = {
  /** Products created, edited and deleted in this browser since the page was opened. */
  mutations: ProductMutations
  addProduct: (product: Product) => void
  updateProduct: (id: number, changes: Partial<Product>) => void
  removeProduct: (id: number) => void
}

const SessionProductsContext = createContext<SessionProductsContextValue | null>(null)

/**
 * DummyJSON only simulates writes, and our API only reads (R10): the admin's changes live
 * here until the page is reloaded (R77, R112, R114). The pages from the server are shown
 * with these changes applied (see utils/productMutations.ts).
 */
export function SessionProductsProvider({ children }: { children: ReactNode }) {
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
  const value = useMemo<SessionProductsContextValue>(
    () => ({ mutations, addProduct, updateProduct, removeProduct }),
    [mutations, addProduct, updateProduct, removeProduct],
  )

  return <SessionProductsContext value={value}>{children}</SessionProductsContext>
}

export function useSessionProducts(): SessionProductsContextValue {
  const context = useContext(SessionProductsContext)
  if (!context) {
    throw new Error('useSessionProducts doit être utilisé dans <SessionProductsProvider>.')
  }
  return context
}
