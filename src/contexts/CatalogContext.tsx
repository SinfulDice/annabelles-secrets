import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { API_URLS } from '../constants/config'
import { useRemoteData, type RemoteData } from '../hooks/useRemoteData'
import type { CatalogSummary } from '../types'

type CatalogContextValue = {
  state: RemoteData<CatalogSummary>
  retry: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

/**
 * The small catalogue summary (R18), loaded once for the whole app: product counts for the
 * home page, product types for the « Type » filter (R22). Its size does not grow with the
 * number of products, unlike the old "load all 45 products" approach.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const { state, retry } = useRemoteData<CatalogSummary>(API_URLS.catalog)
  const value = useMemo(() => ({ state, retry }), [state, retry])
  return <CatalogContext value={value}>{children}</CatalogContext>
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog doit être utilisé dans <CatalogProvider>.')
  }
  return context
}

/** The summary once loaded, null before (or after an error): callers show nothing then. */
export function useCatalogSummary(): CatalogSummary | null {
  const { state } = useCatalog()
  return state.status === 'success' ? state.data : null
}
