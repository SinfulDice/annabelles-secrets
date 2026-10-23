import { API_URLS, MAX_PAGE_SIZE, PAGE_SIZE, SORT_LABELS } from '../constants/config'
import type { Category, Filters, ProductQuery, SortOption } from '../types'

export const DEFAULT_QUERY: ProductQuery = {
  query: '',
  categories: [],
  type: '',
  maxPrice: null,
  waterproofOnly: false,
  sort: 'rating',
  page: 1,
  pageSize: PAGE_SIZE,
}

const CATEGORIES: readonly Category[] = ['femme', 'homme', 'goodies']

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value)
}

function isSortOption(value: string): value is SortOption {
  return value in SORT_LABELS
}

/** The shop's filters (FiltersContext) → what we ask the server. */
export function toProductQuery(filters: Filters, pageSize = PAGE_SIZE): ProductQuery {
  return {
    query: filters.query.trim(),
    categories: filters.category === 'all' ? [] : [filters.category],
    type: filters.type,
    maxPrice: filters.maxPrice,
    waterproofOnly: filters.waterproofOnly,
    sort: filters.sort,
    page: filters.page,
    pageSize,
  }
}

/**
 * Browser side: query → URL parameters. Default values are left out, so the addresses stay
 * short (`?category=femme&page=2`) and two equal queries always give the same text.
 */
export function toProductQueryParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.query !== '') params.set('q', query.query)
  if (query.categories.length > 0) params.set('category', query.categories.join(','))
  if (query.type !== '') params.set('type', query.type)
  if (query.maxPrice !== null) params.set('maxPrice', String(query.maxPrice))
  if (query.waterproofOnly) params.set('waterproof', 'true')
  if (query.sort !== DEFAULT_QUERY.sort) params.set('sort', query.sort)
  if (query.page !== DEFAULT_QUERY.page) params.set('page', String(query.page))
  if (query.pageSize !== DEFAULT_QUERY.pageSize) params.set('pageSize', String(query.pageSize))
  return params
}

/** Address of one page of products, e.g. `/api/products?category=femme&page=2`. */
export function productPagePath(query: ProductQuery): string {
  const params = toProductQueryParams(query).toString()
  return params === '' ? API_URLS.products : `${API_URLS.products}?${params}`
}

/** A whole number between min and max, or null. */
function parseInteger(raw: string | null, min: number, max: number): number | null {
  if (raw === null || !/^\d+$/.test(raw)) return null
  const value = Number(raw)
  return value >= min && value <= max ? value : null
}

/**
 * Server side: URL parameters → query (R17). The URL can be typed by anyone, so nothing is
 * trusted: an invalid value takes its default instead of causing an error.
 */
export function parseProductQueryParams(params: URLSearchParams): ProductQuery {
  const categories = (params.get('category') ?? '').split(',').filter(isCategory)
  const maxPrice = Number(params.get('maxPrice') ?? Number.NaN)
  const sort = params.get('sort') ?? ''

  return {
    query: (params.get('q') ?? '').trim(),
    categories: [...new Set(categories)],
    type: (params.get('type') ?? '').trim(),
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : null,
    waterproofOnly: params.get('waterproof') === 'true',
    sort: isSortOption(sort) ? sort : DEFAULT_QUERY.sort,
    page: parseInteger(params.get('page'), 1, Number.MAX_SAFE_INTEGER) ?? DEFAULT_QUERY.page,
    pageSize: parseInteger(params.get('pageSize'), 1, MAX_PAGE_SIZE) ?? DEFAULT_QUERY.pageSize,
  }
}
