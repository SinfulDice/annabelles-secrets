import { expect, test } from './fixtures'

test('R60 R61 R64 un favori ajouté est compté, annoncé, et survit au rechargement', async ({
  page,
}) => {
  await page.goto('/produits')

  // « Onde Rosée » is the best rated product: first card with the default sort (R25).
  const heart = page.getByRole('button', { name: 'Favori : Onde Rosée' })
  await heart.click()

  await expect(heart).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('status')).toContainText('« Onde Rosée » ajouté à vos favoris')
  await expect(page.getByRole('link', { name: 'Favoris (1)' })).toBeVisible()

  // Stored in localStorage (R61).
  await page.reload()
  await expect(page.getByRole('link', { name: 'Favoris (1)' })).toBeVisible()

  await page.getByRole('link', { name: 'Favoris (1)' }).click()
  await expect(page.getByRole('main').getByText('Onde Rosée')).toBeVisible()
})

test('R63 retirer un favori, tout retirer, puis l’état vide', async ({ page }) => {
  await page.goto('/produits')
  await page.getByRole('button', { name: 'Favori : Onde Rosée' }).click()
  // The heart of the second card, whatever its name.
  await page
    .getByRole('button', { name: /^Favori : / })
    .nth(1)
    .click()
  await page.getByRole('link', { name: 'Favoris (2)' }).click()

  await expect(page.getByText('2 produits · enregistrés sur cet appareil')).toBeVisible()
  await page.getByRole('button', { name: 'Retirer Onde Rosée des favoris' }).click()
  await expect(page.getByText('1 produit · enregistrés sur cet appareil')).toBeVisible()

  await page.getByRole('button', { name: 'Tout retirer' }).click()
  await expect(page.getByRole('heading', { name: "Vous n'avez encore aucun favori" })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Favoris (0)' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Parcourir la boutique' })).toBeVisible()
})

test('R62 la page des favoris s’affiche même si l’API est en panne', async ({ page }) => {
  await page.goto('/produits')
  await page.getByRole('button', { name: 'Favori : Onde Rosée' }).click()

  // From now on, every products request fails.
  await page.route('**/*', (route) =>
    route.request().resourceType() === 'fetch' ? route.fulfill({ status: 500 }) : route.fallback(),
  )
  await page.goto('/favoris')

  // The favorite is a stored snapshot: no request is needed to show it.
  await expect(page.getByRole('link', { name: 'Voir la fiche de Onde Rosée' })).toBeVisible()
  await expect(page.getByText('89,00 €')).toBeVisible()
})
