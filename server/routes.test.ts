import { describe, expect, it } from 'vitest'
import type { CatalogSummary, ProductPage } from '../src/types'
import { handleApiRequest } from './routes'

/** Calls the API like a browser would, with the real data/products.json. */
async function get<T>(path: string, method = 'GET') {
  const response = handleApiRequest(new Request(`http://localhost${path}`, { method }))
  return { status: response.status, body: (await response.json()) as T }
}

describe('R10 R17 R18 the API, with the real catalogue', () => {
  it('GET /api/products → page 1, 12 of the 45 products', async () => {
    const { status, body } = await get<ProductPage>('/api/products')
    expect(status).toBe(200)
    expect(body.products).toHaveLength(12)
    expect(body).toMatchObject({ total: 45, page: 1, totalPages: 4, pageSize: 12 })
  })

  it('GET /api/products?category=goodies → the 5 goodies', async () => {
    const { body } = await get<ProductPage>('/api/products?category=goodies')
    expect(body.total).toBe(5)
    expect(body.products.every((product) => product.category === 'goodies')).toBe(true)
  })

  it('GET /api/products/1 → Onde Rosée', async () => {
    const { status, body } = await get<{ title: string }>('/api/products/1')
    expect(status).toBe(200)
    expect(body.title).toBe('Onde Rosée')
  })

  it.each(['/api/products/9999', '/api/products/abc', '/api/inconnu', '/api/products/1/x'])(
    '%s → 404 with a message in French',
    async (path) => {
      const { status, body } = await get<{ error: string }>(path)
      expect(status).toBe(404)
      expect(body.error).toMatch(/introuvable|inconnue/)
    },
  )

  it('GET /api/catalog → 45 products: 20 femme, 20 homme, 5 goodies', async () => {
    const { body } = await get<CatalogSummary>('/api/catalog')
    expect(body.total).toBe(45)
    expect(body.categories.femme.count).toBe(20)
    expect(body.categories.homme.count).toBe(20)
    expect(body.categories.goodies.count).toBe(5)
  })

  it('only reads: POST → 405', async () => {
    const { status } = await get('/api/products', 'POST')
    expect(status).toBe(405)
  })
})
