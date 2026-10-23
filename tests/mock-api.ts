import { readFileSync } from 'node:fs'

/**
 * Fake products address given to the app during e2e tests (R4). It does not exist on the
 * internet: every request to it is answered by Playwright (see fixtures.ts).
 */
export const MOCK_PRODUCTS_URL = 'https://api.e2e.test/products'

/** The same 45 products as the real API (backup copy, R11). */
export const productsResponse: unknown = JSON.parse(
  readFileSync(new URL('../data/products.json', import.meta.url), 'utf-8'),
)
