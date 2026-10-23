import { useCallback } from 'react'
import { useFilters } from '../contexts/FiltersContext'
import { useCatalogSummary } from '../contexts/CatalogContext'
import type { CategoryFilter } from '../types'
import { typesForCategory } from '../utils/catalogTypes'

/**
 * Used by the header links and the home tiles: puts the category in the filters context
 * just before the link opens /produits (R81).
 */
export function useSelectCategory() {
  const { dispatch } = useFilters()
  const catalog = useCatalogSummary()

  return useCallback(
    (category: CategoryFilter) => {
      dispatch({
        type: 'categoryChanged',
        category,
        typesInCategory: typesForCategory(catalog, category),
      })
    },
    [dispatch, catalog],
  )
}
