import { AdBanner } from '../components/ads/AdBanner'
import { ProductsError } from '../components/products/ProductsError'
import { ProductsLoading } from '../components/products/ProductsLoading'
import { SearchForm } from '../components/products/SearchForm'
import { SessionProducts } from '../components/products/SessionProducts'
import { ShopResults } from '../components/products/ShopResults'
import { useCatalogSummary } from '../contexts/CatalogContext'
import { useFilters } from '../contexts/FiltersContext'
import { useSessionProducts } from '../contexts/SessionProductsContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useRemoteData } from '../hooks/useRemoteData'
import { useSelectCategory } from '../hooks/useSelectCategory'
import { useSearchText } from '../hooks/useSearchText'
import type { ProductPage } from '../types'
import type { FilterKey } from '../utils/activeFilters'
import { typesForCategory } from '../utils/catalogTypes'
import { applySessionChanges, sessionCreatedProducts } from '../utils/productMutations'
import { productPagePath, toProductQuery } from '../utils/productQuery'

const LOADING_CARD_COUNT = 8

export function ProductsPage() {
  usePageTitle('Boutique')
  const { filters, dispatch } = useFilters()
  const { mutations } = useSessionProducts()
  const catalog = useCatalogSummary()
  const { searchText, setSearchText, clearSearchText } = useSearchText()
  const selectCategory = useSelectCategory()

  // R11 R19: the server filters, sorts and cuts. Each new address (new criterion or page)
  // is one request; the browser never receives more than one page.
  const { state, retry } = useRemoteData<ProductPage>(productPagePath(toProductQuery(filters)))
  // While the next page loads, the previous one stays on screen (R41).
  const shownPage =
    state.status === 'success' ? state.data : state.status === 'loading' ? state.previous : null

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
    window.scrollTo({ top: 0 })
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
        availableTypes={typesForCategory(catalog, filters.category)}
        onRemoveFilter={removeFilter}
        onReset={resetFilters}
      />
      <AdBanner />

      <SessionProducts products={sessionCreatedProducts(mutations)} />

      {state.status === 'error' && <ProductsError message={state.error} onRetry={retry} />}
      {/* Skeletons only for the very first load: later, the old cards wait greyed out. */}
      {state.status === 'loading' && shownPage === null && (
        <ProductsLoading cardCount={LOADING_CARD_COUNT} />
      )}
      {shownPage && state.status !== 'error' && (
        <ShopResults
          page={{ ...shownPage, products: applySessionChanges(shownPage.products, mutations) }}
          isUpdating={state.status === 'loading'}
          onPageChange={changePage}
          onReset={resetFilters}
        />
      )}
    </div>
  )
}
