import { expect, test } from './fixtures'

test('R50 R51 la fiche montre les infos du produit et le prix barré quand il y a une remise', async ({
  page,
}) => {
  await page.goto('/produits/1')

  await expect(page.getByRole('heading', { level: 1, name: 'Onde Rosée' })).toBeVisible()
  await expect(page).toHaveTitle("Onde Rosée – Annabelle's Secrets")
  await expect(page.getByText('ANB-F001')).toBeVisible()
  // 89 € with 10 % off: original price = 89 / 0.9 = 98,89 € (R51).
  await expect(page.getByText('89,00 €').first()).toBeVisible()
  await expect(page.getByText('98,89 €')).toBeVisible()
  await expect(page.getByText('−10 %')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Retour aux résultats' })).toBeVisible()
})

test('R53 un id inconnu ou invalide affiche « Produit introuvable »', async ({ page }) => {
  for (const id of ['9999', 'abc']) {
    await page.goto(`/produits/${id}`)
    await expect(page.getByRole('heading', { name: 'Produit introuvable' })).toBeVisible()
  }
})

test('R54 R58 les avis sont les mêmes après rechargement, et le filtre 5★ ne garde que les 5★', async ({
  page,
}) => {
  await page.goto('/produits/1')
  const reviews = page.getByRole('region', { name: /avis/i })
  const reviewTitles = reviews.getByRole('heading', { level: 3 })
  await expect(reviewTitles.first()).toBeVisible()
  const before = await reviewTitles.allTextContents()

  // Deterministic: same product id → same reviews, never Math.random (R54).
  await page.reload()
  await expect(reviewTitles.first()).toBeVisible()
  expect(await reviewTitles.allTextContents()).toEqual(before)

  // The label says how many 5★ reviews there are, e.g. « 5★ (6) »: the list must match.
  const fiveStars = reviews.getByText(/^5★ \(\d+\)$/)
  const count = Number((await fiveStars.textContent())?.match(/\((\d+)\)/)?.[1])
  await fiveStars.click()
  await expect(reviews.getByRole('listitem')).toHaveCount(count)
})
