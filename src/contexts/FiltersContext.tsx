import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { Filters } from '../types'
import { filtersReducer, initialFilters, type FiltersAction } from './filtersReducer'

type FiltersContextValue = {
  filters: Filters
  dispatch: Dispatch<FiltersAction>
}

const FiltersContext = createContext<FiltersContextValue | null>(null)

/**
 * Placed above the router, so the search survives going from the list to a product page
 * and back (R29). It is not saved in localStorage: a reload starts a fresh search.
 */
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters)
  const value = useMemo(() => ({ filters, dispatch }), [filters])
  return <FiltersContext value={value}>{children}</FiltersContext>
}

export function useFilters(): FiltersContextValue {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error('useFilters doit être utilisé dans <FiltersProvider>.')
  }
  return context
}
