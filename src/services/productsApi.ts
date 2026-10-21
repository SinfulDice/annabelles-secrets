import { API_URLS } from '../constants/config'
import type { CreatedProductResponse, Product, ProductPayload, ProductsResponse } from '../types'
import { httpRequest } from './http'

export const MISSING_URL_MESSAGE =
  "L'adresse de l'API n'est pas configurée : ajoutez VITE_PRODUCTS_URL dans le fichier .env (voir le README)."

/** Loads the 45 products once; search, filters and pagination then happen in the browser. */
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  if (!API_URLS.products) {
    throw new Error(MISSING_URL_MESSAGE)
  }
  const data = await httpRequest<ProductsResponse>(withOriginInUrl(API_URLS.products), { signal })
  return data.products
}

/**
 * Workaround for a DummyJSON bug: Custom Response answers are cached for 24 h together with
 * the CORS permission of the first site that asked, so every other site gets blocked.
 * Putting our own address in the URL gives each site its own cache entry.
 */
function withOriginInUrl(url: string): string {
  const urlWithOrigin = new URL(url)
  urlWithOrigin.searchParams.set('origin', window.location.origin)
  return urlWithOrigin.toString()
}

/** POST /products/add: DummyJSON simulates the creation and answers with an id (R73). */
export function createProduct(
  payload: ProductPayload,
  signal?: AbortSignal,
): Promise<CreatedProductResponse> {
  return httpRequest<CreatedProductResponse>(API_URLS.createProduct, {
    method: 'POST',
    body: payload,
    signal,
  })
}

/**
 * PUT /products/{id}. Only the HTTP status matters: for ids 1–45 DummyJSON answers with its own
 * product of the same id mixed with what we sent, so the answer is ignored (R110).
 */
export async function updateProduct(
  id: number,
  payload: ProductPayload,
  signal?: AbortSignal,
): Promise<void> {
  await httpRequest<unknown>(`${API_URLS.productsBase}/${id}`, {
    method: 'PUT',
    body: payload,
    signal,
  })
}

/** DELETE /products/{id}: DummyJSON answers `isDeleted: true` (R111). */
export async function deleteProduct(id: number, signal?: AbortSignal): Promise<void> {
  await httpRequest<unknown>(`${API_URLS.productsBase}/${id}`, { method: 'DELETE', signal })
}
