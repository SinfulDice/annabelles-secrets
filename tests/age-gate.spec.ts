import { expect, test } from './fixtures'

// This file tests the real dialog, so the 18+ answer is NOT stored in advance.
test.use({ ageConfirmed: false })

test('R87 la vérification d’âge bloque le site, puis le choix est retenu', async ({ page }) => {
  await page.goto('/')

  const dialog = page.getByRole('dialog', { name: 'Ce site est réservé aux personnes majeures' })
  await expect(dialog).toBeVisible()
  const enterButton = dialog.getByRole('button', { name: "J'ai 18 ans ou plus — Entrer" })
  await expect(enterButton).toBeFocused()

  await enterButton.click()
  await expect(dialog).toBeHidden()

  // Stored in localStorage: after a reload, the dialog does not come back.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(dialog).toBeHidden()
})

test('R87 « Quitter » fait sortir du site', async ({ page }) => {
  // We don't really load Google during the test: Playwright answers in its place.
  await page.route('https://www.google.fr/**', (route) => route.fulfill({ body: 'Google' }))
  await page.goto('/')

  await page.getByRole('button', { name: "J'ai moins de 18 ans — Quitter" }).click()
  await expect(page).toHaveURL(/^https:\/\/www\.google\.fr/)
})
