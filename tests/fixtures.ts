import { test as base } from '@playwright/test'

type Options = {
  /** true (default): the 18+ answer is already stored, the age dialog never shows up. */
  ageConfirmed: boolean
}

/**
 * Our own `test`: same as Playwright's, but every page is prepared before the test starts.
 * Spec files import `test` from here instead of from '@playwright/test'.
 */
export const test = base.extend<Options>({
  ageConfirmed: [true, { option: true }],

  // Playwright calls the 2nd parameter `use` in its docs; renamed so the React hooks lint rule
  // doesn't mistake it for React's use() hook.
  page: async ({ page, ageConfirmed }, runTest) => {
    if (ageConfirmed) {
      // Runs in the browser before the app's own code, on every page load.
      // Same key as STORAGE_KEYS.ageConfirmed (src/constants/config.ts can't be imported here).
      await page.addInitScript(() => localStorage.setItem('annabelle:age-confirmed', 'true'))
    }

    // The pop-up ad (R123) would cover the page after 20 s and block the clicks of a slow test:
    // we tell the app it was already shown in this tab (same key as STORAGE_KEYS.adPopupShown).
    await page.addInitScript(() => sessionStorage.setItem('annabelle:ad-popup-shown', 'true'))

    await runTest(page)
  },
})

export { expect } from '@playwright/test'
