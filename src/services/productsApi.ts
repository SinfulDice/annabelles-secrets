import { API_URLS } from '../constants/config'
import type { CreatedProductResponse, ProductPayload } from '../types'
import { httpRequest } from './http'

// Reading goes through our own API, with the useRemoteData hook (R10). Writing still goes to
// DummyJSON, which only simulates it: the changes are kept by SessionProductsContext.

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
