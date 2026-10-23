import productsFile from '../data/products.json'
import type { ApiError, Product } from '../src/types'
import { parseProductQueryParams } from '../src/utils/productQuery'
import { findProduct, queryProducts, summarizeCatalog } from './catalog'

/**
 * Our "database" (R10). The JSON file is bundled with the server code; the browser code in
 * src/ never imports it (R11). The file is ours and checked by hand, so we trust its shape.
 */
const catalogue = productsFile.products as Product[]

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}

function error(message: string, status: number): Response {
  const body: ApiError = { error: message }
  return json(body, status)
}

/**
 * The whole API in one function: a standard Request in, a standard Response out.
 * The same function runs on Vercel (files in api/) and in `npm run dev` (server/devServer.ts).
 */
export function handleApiRequest(request: Request): Response {
  if (request.method !== 'GET') return error('Méthode non autorisée.', 405)

  const url = new URL(request.url)
  // "/api/products/12/" → ["api", "products", "12"]
  const [prefix, resource, id, ...rest] = url.pathname.split('/').filter(Boolean)
  if (prefix !== 'api' || rest.length > 0) return error('Adresse inconnue.', 404)

  if (resource === 'products' && id === undefined) {
    return json(queryProducts(catalogue, parseProductQueryParams(url.searchParams)))
  }
  if (resource === 'products' && id !== undefined) {
    const product = findProduct(catalogue, id)
    return product ? json(product) : error('Produit introuvable.', 404)
  }
  if (resource === 'catalog' && id === undefined) {
    return json(summarizeCatalog(catalogue))
  }
  return error('Adresse inconnue.', 404)
}
