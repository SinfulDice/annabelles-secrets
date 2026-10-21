import { useCallback } from 'react'
import { useFilters } from '../contexts/FiltersContext'
import { useProductsContext } from '../contexts/ProductsContext'
import type { CategoryFilter } from '../types'
import { getAvailableTypes } from '../utils/filterProducts'

/**
 * Used by the header links and the home tiles: puts the category in the filters context
 * just before the link opens /produits (R81).
 */
export function useSelectCategory() {
  const { dispatch } = useFilters()
  const { state } = useProductsContext()

  return useCallback(
    (category: CategoryFilter) => {
      const products = state.status === 'success' ? state.products : []
      dispatch({
        type: 'categoryChanged',
        category,
        typesInCategory: getAvailableTypes(products, category),
      })
    },
    [dispatch, state],
  )
}
