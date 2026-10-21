import { useCallback, useEffect, useState } from 'react'
import { DEBOUNCE_MS } from '../constants/config'
import { useFilters } from '../contexts/FiltersContext'
import { useDebouncedValue } from './useDebouncedValue'

/**
 * The text typed in the search field. It lives here (updated on every key press) and only
 * reaches the filters context 300 ms after the last key press.
 */
export function useSearchText() {
  const { filters, dispatch } = useFilters()
  // Starts from the context: coming back from a product page shows the previous search.
  const [searchText, setSearchText] = useState(filters.query)
  const debouncedText = useDebouncedValue(searchText, DEBOUNCE_MS)

  useEffect(() => {
    dispatch({ type: 'queryChanged', query: debouncedText })
  }, [debouncedText, dispatch])

  /** Clears at once (no 300 ms wait): used by the × button, the chip and the reset buttons. */
  const clearSearchText = useCallback(() => {
    setSearchText('')
    dispatch({ type: 'queryChanged', query: '' })
  }, [dispatch])

  return { searchText, setSearchText, clearSearchText }
}
