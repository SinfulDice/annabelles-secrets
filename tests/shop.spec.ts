import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { MOCK_PRODUCTS_URL } from './mock-api'

// The line « 45 résultats · Page 1 sur 4 » above the grid (R33).
const resultCount = (page: Page) => page.getByText(/\d+ résultats? · Page \d+ sur \d+/)

test('R20 R31 la recherche ignore les majuscules et les accents', async ({ page }) => {
  await page.goto('/produits')

  await page.getByRole('searchbox', { name: 'Rechercher un produit' }).fill('ONDE ROSEE')

  // No click on « search »: the list updates by itself 300 ms after typing.
  await expect(resultCount(page)).toHaveText('1 résultat · Page 1 sur 1')
  await expect(page.getByRole('link', { name: 'Onde Rosée' })).toBeVisible()
})

test('R27 pagination : 12 produits par page, Précédent et Suivant désactivés aux bouts', async ({
  page,
}) => {
  await page.goto('/produits')
  const favoriteButtons = page.getByRole('button', { name: /^Favori : / })

  await expect(resultCount(page)).toHaveText('45 résultats · Page 1 sur 4')
  await expect(favoriteButtons).toHaveCount(12)
  await expect(page.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('button', { name: 'Précédent' })).toBeDisabled()

  await page.getByRole('button', { name: 'Page 4' }).click()
  await expect(resultCount(page)).toHaveText('45 résultats · Page 4 sur 4')
  await expect(favoriteButtons).toHaveCount(9) // 45 - 3 × 12
  await expect(page.getByRole('button', { name: 'Suivant' })).toBeDisabled()
})

test('R26 R28 les filtres se cumulent et ramènent toujours à la page 1', async ({ page }) => {
  await page.goto('/produits')
  await page.getByRole('button', { name: 'Page 2' }).click()
  await expect(resultCount(page)).toHaveText('45 résultats · Page 2 sur 4')

  await page.getByRole('group', { name: 'Catégorie' }).getByText('Femme').click()
  await expect(resultCount(page)).toHaveText('20 résultats · Page 1 sur 2')

  await page.getByRole('checkbox', { name: 'Étanche uniquement' }).check()
  await expect(resultCount(page)).toHaveText('11 résultats · Page 1 sur 1')
})

test('R29 R50 les filtres et la page sont gardés après un aller-retour vers une fiche', async ({
  page,
}) => {
  await page.goto('/produits')
  await page.getByRole('group', { name: 'Catégorie' }).getByText('Femme').click()
  await page.getByRole('button', { name: 'Page 2' }).click()
  await expect(resultCount(page)).toHaveText('20 résultats · Page 2 sur 2')

  // Open the first product of the grid (cards have their name as an h3 link).
  await page.getByRole('heading', { level: 3 }).first().getByRole('link').click()
  await expect(page).toHaveURL(/\/produits\/\d+$/)

  await page.getByRole('link', { name: 'Retour aux résultats' }).click()
  await expect(resultCount(page)).toHaveText('20 résultats · Page 2 sur 2')
  await expect(page.getByRole('radio', { name: 'Femme' })).toBeChecked()
})

test('R42 si l’API est en panne, un message clair et « Réessayer » qui recharge', async ({
  page,
}) => {
  // Added after the fixture's route, so it is asked first. fallback() = "let the fixture answer".
  let apiIsDown = true
  await page.route(`${MOCK_PRODUCTS_URL}**`, (route) =>
    apiIsDown ? route.fulfill({ status: 500 }) : route.fallback(),
  )

  await page.goto('/produits')
  await expect(
    page.getByRole('heading', { name: 'Impossible de charger les produits' }),
  ).toBeVisible()

  apiIsDown = false
  await page.getByRole('button', { name: 'Réessayer' }).click()
  await expect(resultCount(page)).toHaveText('45 résultats · Page 1 sur 4')
})

test('R25 le tri « Prix croissant » met le produit le moins cher en premier', async ({ page }) => {
  await page.goto('/produits')

  await page.getByRole('combobox', { name: 'Trier par' }).selectOption({ label: 'Prix croissant' })

  // In data/products.json the cheapest product is « Lot de 6 stickers » (6,90 €).
  await expect(page.getByRole('heading', { level: 3 }).first()).toHaveText('Lot de 6 stickers')
})

test('R22 la liste des types suit la catégorie, et un type absent est remis à « Tous »', async ({
  page,
}) => {
  await page.goto('/produits')
  const categories = page.getByRole('group', { name: 'Catégorie' })
  const typeSelect = page.getByRole('combobox', { name: 'Type de produit' })

  await categories.getByText('Femme').click()
  await typeSelect.selectOption('Vibromasseur rabbit')
  await expect(page.getByText(/^\d+ résultats? · Page 1 sur 1$/)).toBeVisible()

  // « Vibromasseur rabbit » does not exist for men: the type goes back to « Tous les types ».
  await categories.getByText('Homme').click()
  await expect(typeSelect).toHaveValue('')
  await expect(typeSelect.getByRole('option', { name: 'Vibromasseur rabbit' })).toHaveCount(0)
  await expect(typeSelect.getByRole('option', { name: 'Masturbateur', exact: true })).toHaveCount(1)
})

test('R32 une chip retire son filtre, « Réinitialiser les filtres » retire tout', async ({
  page,
}) => {
  await page.goto('/produits')
  await page.getByRole('group', { name: 'Catégorie' }).getByText('Goodies').click()
  await page.getByRole('checkbox', { name: 'Étanche uniquement' }).check()
  await page.getByRole('searchbox', { name: 'Rechercher un produit' }).fill('mug')
  await expect(page.getByRole('button', { name: 'Retirer le filtre « mug »' })).toBeVisible()

  await page.getByRole('button', { name: 'Retirer le filtre Étanche' }).click()
  await expect(page.getByRole('checkbox', { name: 'Étanche uniquement' })).not.toBeChecked()
  await expect(page.getByRole('button', { name: 'Retirer le filtre Goodies' })).toBeVisible()

  await page.getByRole('button', { name: 'Réinitialiser les filtres' }).click()
  await expect(page.getByText('45 résultats · Page 1 sur 4')).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Rechercher un produit' })).toHaveValue('')
  await expect(page.getByRole('button', { name: /^Retirer le filtre/ })).toHaveCount(0)
})

test('R43 aucun résultat : un message, les critères rappelés, et de quoi tout réinitialiser', async ({
  page,
}) => {
  await page.goto('/produits')
  await page.getByRole('searchbox', { name: 'Rechercher un produit' }).fill('licorne')

  await expect(page.getByRole('heading', { name: 'Aucun produit ne correspond' })).toBeVisible()
  await expect(page.getByText('Rien pour « licorne »')).toBeVisible()

  // Two « Réinitialiser » buttons now (chips + message): we use the message's one.
  await page.getByRole('button', { name: 'Réinitialiser les filtres' }).last().click()
  await expect(page.getByText('45 résultats · Page 1 sur 4')).toBeVisible()
})
