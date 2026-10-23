import { expect, test } from './fixtures'

test('R131 R132 le mode NSFW demande confirmation, puis floute les photos jusqu’au clic', async ({
  page,
}) => {
  await page.goto('/produits/1')

  await page
    .getByRole('button', { name: 'Mode SFW activé. Passer en NSFW' })
    .filter({ visible: true })
    .click()
  const dialog = page.getByRole('dialog', { name: 'Afficher les photos réelles ?' })
  await expect(dialog.getByRole('button', { name: 'Rester en SFW' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Passer en NSFW' }).click()

  // The real photo is blurred: a button shows it, then another one hides it again.
  await page.getByRole('button', { name: "Afficher l'image de Onde Rosée" }).first().click()
  await expect(page.getByRole('button', { name: "Masquer l'image de Onde Rosée" })).toBeVisible()
})

test.describe('thème', () => {
  // Start from a light system theme, so the test does not depend on the computer's setting.
  test.use({ colorScheme: 'light' })

  test('R150 le thème sombre s’active et reste choisi après rechargement', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)

    await page
      .getByRole('button', { name: 'Activer le thème sombre' })
      .filter({ visible: true })
      .click()
    await expect(html).toHaveClass(/\bdark\b/)

    await page.reload()
    await expect(html).toHaveClass(/\bdark\b/)
    await expect(
      page.getByRole('button', { name: 'Activer le thème clair' }).filter({ visible: true }),
    ).toBeVisible()
  })
})
