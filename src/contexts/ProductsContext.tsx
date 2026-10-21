import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useProducts, type ProductsState } from '../hooks/useProducts'
import type { Product } from '../types'

type ProductsContextValue = {
  /** Loaded products plus the ones created in this browser (lost on reload, as allowed). */
  state: ProductsState
  retry: () => void
  addProduct: (product: Product) => void
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { state: loadState, retry } = useProducts()
  const [createdProducts, setCreatedProducts] = useState<Product[]>([])

  const addProduct = useCallback((product: Product) => {
    setCreatedProducts((previous) => [...previous, { ...product, isLocal: true }])
  }, [])

  // useMemo: without it, a new object would be created on every render and every component
  // reading this context would re-render, even when nothing changed.
  const value = useMemo<ProductsContextValue>(() => {
    const state: ProductsState =
      loadState.status === 'success'
        ? { status: 'success', products: [...loadState.products, ...createdProducts] }
        : loadState
    return { state, retry, addProduct }
  }, [loadState, createdProducts, retry, addProduct])

  return <ProductsContext value={value}>{children}</ProductsContext>
}

export function useProductsContext(): ProductsContextValue {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProductsContext doit être utilisé dans <ProductsProvider>.')
  }
  return context
}
