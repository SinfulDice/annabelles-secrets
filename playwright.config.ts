import { defineConfig, devices } from '@playwright/test'
import { MOCK_PRODUCTS_URL } from './tests/mock-api'

/** Its own port, so the tests never reuse the `npm run dev` you have open on 5173. */
const PORT = 5174

/** End-to-end tests (R4). See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Fail on CI if a test.only was forgotten.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // page.goto('/produits') means http://localhost:5174/produits.
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Playwright starts the site itself before the tests, and stops it after.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // Variables given here win over the .env file: the app asks the fake API (R4).
    env: { VITE_PRODUCTS_URL: MOCK_PRODUCTS_URL },
  },
})
