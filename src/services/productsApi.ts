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
  const data = await httpRequest<ProductsResponse>(API_URLS.products, { signal })
  return data.products
}
