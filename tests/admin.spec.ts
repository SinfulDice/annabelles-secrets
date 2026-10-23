import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

const ADMIN = { email: 'admin@annabelles-secrets.fr', password: 'P4ssw0rd' } // R100

async function signInAsAdmin(page: Page) {
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill(ADMIN.email)
  await page.getByRole('textbox', { name: 'Mot de passe', exact: true }).fill(ADMIN.password)
  await page.getByRole('button', { name: 'Se connecter' }).click()
}

test('R106 un visiteur est bloqué sur la création, puis y revient après connexion admin', async ({
  page,
}) => {
  await page.goto('/produits/nouveau')
  await expect(page.getByRole('heading', { name: "Réservé à l'administratrice" })).toBeVisible()

  await page.getByRole('link', { name: 'Se connecter' }).click()
  await signInAsAdmin(page)

  // ?retour=/produits/nouveau sends the admin back to the page she asked for.
  await expect(page).toHaveURL('/produits/nouveau')
  await expect(page.getByRole('heading', { name: 'Ajouter un produit' })).toBeVisible()
})

test('R73 R76 R77 l’admin crée un produit, voit le récapitulatif, et le retrouve dans la boutique', async ({
  page,
}) => {
  // Fake DummyJSON: like the real one, it sends back what it got, plus id 195 (R78).
  await page.route('https://dummyjson.com/products/add', async (route) => {
    const sent: unknown = route.request().postDataJSON()
    await route.fulfill({ status: 201, json: { ...(sent as object), id: 195 } })
  })

  await page.goto('/compte')
  await signInAsAdmin(page)
  await page.goto('/produits/nouveau')

  await page.getByRole('textbox', { name: 'Nom du produit' }).fill('Plume Test')
  await page.getByRole('textbox', { name: /^Type/ }).fill('Stimulateur')
  await page.getByRole('textbox', { name: /^Prix/ }).fill('49,90')
  await page.getByRole('textbox', { name: /^Stock/ }).fill('7')
  await page
    .getByRole('textbox', { name: /^Description/ })
    .fill('Un produit créé par un test automatique Playwright.')
  await page.getByRole('button', { name: 'Créer le produit' }).click()

  // R76: the summary is built from the API answer.
  await expect(page.getByRole('heading', { name: 'Produit créé avec succès' })).toBeVisible()
  await expect(page.getByText('Plume Test')).toBeVisible()
  await expect(page.getByText('49,90 €')).toBeVisible()

  // R77: the product is in the shop until the next reload (so: a click, not page.goto),
  // in its own block: the server doesn't know it, so it can't be in its pages.
  await page.getByRole('link', { name: 'Boutique' }).first().click()
  const sessionBlock = page.getByRole('region', { name: 'Ajoutés pendant cette session' })
  await sessionBlock.getByRole('link', { name: 'Plume Test' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Plume Test' })).toBeVisible()
})

test('R111 R113 l’admin supprime un produit : il disparaît de la boutique et des favoris', async ({
  page,
}) => {
  await page.route('https://dummyjson.com/products/1', (route) =>
    route.fulfill({ json: { id: 1, isDeleted: true } }),
  )
  await page.goto('/produits')
  await page.getByRole('button', { name: 'Favori : Onde Rosée' }).click()
  await expect(page.getByRole('link', { name: 'Favoris (1)' })).toBeVisible()

  // Client-side navigation only from here: a reload would bring the product back.
  await page.getByRole('link', { name: 'Mon compte (non connecté)' }).click()
  await signInAsAdmin(page)
  await page.getByRole('link', { name: 'Boutique' }).first().click()
  await page.getByRole('link', { name: 'Onde Rosée' }).click()

  await page.getByRole('button', { name: 'Supprimer' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Supprimer « Onde Rosée » ?' })
  await expect(dialog.getByRole('button', { name: 'Annuler' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Oui, supprimer' }).click()

  await expect(page).toHaveURL('/produits')
  // R114: hidden from the page sent by the server (whose total doesn't know about it).
  await expect(page.getByRole('button', { name: /^Favori : / }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Onde Rosée' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Favoris (0)' })).toBeVisible()
})
