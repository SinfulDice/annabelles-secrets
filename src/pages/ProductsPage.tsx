import { ProductsError } from '../components/products/ProductsError'
import { ProductsLoading } from '../components/products/ProductsLoading'
import { SearchForm } from '../components/products/SearchForm'
import { ShopResults } from '../components/products/ShopResults'
import { PAGE_SIZE } from '../constants/config'
import { useFilters } from '../contexts/FiltersContext'
import { useProductsContext } from '../contexts/ProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSelectCategory } from '../hooks/useSelectCategory'
import { useSearchText } from '../hooks/useSearchText'
import type { FilterKey } from '../utils/activeFilters'
import { filterProducts, getAvailableTypes, sortProducts } from '../utils/filterProducts'
import { paginate } from '../utils/paginate'

const LOADING_CARD_COUNT = 8

export function ProductsPage() {
  usePageTitle('Boutique')
  const { state, retry } = useProductsContext()
  const { filters, dispatch } = useFilters()
  const { searchText, setSearchText, clearSearchText } = useSearchText()
  const selectCategory = useSelectCategory()

  // Computed during render, not stored in state: it is always in sync with the filters,
  // and filtering 45 products is instant, so no useMemo is needed.
  const products = state.status === 'success' ? state.products : []
  const results = sortProducts(filterProducts(products, filters), filters.sort)
  const page = paginate(results, filters.page, PAGE_SIZE)

  function resetFilters() {
    clearSearchText()
    dispatch({ type: 'filtersReset' })
  }

  function removeFilter(key: FilterKey) {
    switch (key) {
      case 'query':
        return clearSearchText()
      case 'category':
        return selectCategory('all')
      case 'type':
        return dispatch({ type: 'productTypeChanged', productType: '' })
      case 'maxPrice':
        return dispatch({ type: 'maxPriceChanged', maxPrice: null })
      case 'waterproofOnly':
        return dispatch({ type: 'waterproofOnlyChanged', waterproofOnly: false })
    }
  }

  function changePage(pageNumber: number) {
    dispatch({ type: 'pageChanged', page: pageNumber })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-4xl font-bold sm:text-5xl">Boutique</h1>
        <p className="mt-2 text-ink-muted">Tous nos produits, pour elle et pour lui.</p>
      </header>

      <SearchForm
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onClearSearch={clearSearchText}
        availableTypes={getAvailableTypes(products, filters.category)}
        onRemoveFilter={removeFilter}
        onReset={resetFilters}
      />

      {state.status === 'error' && <ProductsError message={state.error} onRetry={retry} />}
      {(state.status === 'idle' || state.status === 'loading') && (
        <ProductsLoading cardCount={LOADING_CARD_COUNT} />
      )}
      {state.status === 'success' && (
        <ShopResults
          resultCount={results.length}
          page={page}
          onPageChange={changePage}
          onReset={resetFilters}
        />
      )}
    </div>
  )
}
