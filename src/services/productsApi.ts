import { API_URLS } from '../constants/config'
import type { Product, ProductsResponse } from '../types'
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
