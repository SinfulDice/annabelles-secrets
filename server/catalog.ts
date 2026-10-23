import { filterProducts, getAvailableTypes, sortProducts } from '../src/utils/filterProducts'
import { paginate } from '../src/utils/paginate'
import type { CatalogSummary, Category, Product, ProductPage, ProductQuery } from '../src/types'

/**
 * GET /api/products (R11, R17): filters, sorts and cuts the WHOLE catalogue, then sends back
 * one page only. With a real database, this would be a single SQL query
 * (WHERE … ORDER BY … LIMIT 12 OFFSET 24); here the "database" is an array.
 */
export function queryProducts(catalogue: Product[], query: ProductQuery): ProductPage {
  // filterProducts knows one category or "all": the list (femme,homme) is applied before.
  const inCategories =
    query.categories.length === 0
      ? catalogue
      : catalogue.filter((product) => query.categories.includes(product.category))
  const matching = sortProducts(
    filterProducts(inCategories, { ...query, category: 'all' }),
    query.sort,
  )
  const { pageItems, currentPage, totalPages } = paginate(matching, query.page, query.pageSize)

  return {
    products: pageItems,
    total: matching.length,
    page: currentPage,
    totalPages,
    pageSize: query.pageSize,
  }
}

/**
 * GET /api/products/:id (R18): the id comes from the URL, so it can be anything
 * ("abc", "-3", "2.5"…). undefined → the server answers 404.
 */
export function findProduct(catalogue: Product[], rawId: string): Product | undefined {
  if (!/^\d+$/.test(rawId)) return undefined
  const id = Number(rawId)
  return catalogue.find((product) => product.id === id)
}

/** GET /api/catalog (R18): counts and types per category, for the home page and the filters. */
export function summarizeCatalog(catalogue: Product[]): CatalogSummary {
  const summaryOf = (category: Category) => ({
    count: catalogue.filter((product) => product.category === category).length,
    types: getAvailableTypes(catalogue, category),
  })

  return {
    total: catalogue.length,
    categories: {
      femme: summaryOf('femme'),
      homme: summaryOf('homme'),
      goodies: summaryOf('goodies'),
    },
  }
}
