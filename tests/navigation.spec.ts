import { expect, test } from './fixtures'

test('R7 R8 une adresse inconnue affiche la page 404 avec un lien vers l’accueil', async ({
  page,
}) => {
  await page.goto('/cette-page-n-existe-pas')

  await expect(page.getByRole('heading', { name: "Cette page n'existe pas" })).toBeVisible()
  await expect(page).toHaveTitle("Page introuvable – Annabelle's Secrets")

  await page.getByRole('link', { name: "Retour à l'accueil" }).click()
  await expect(page).toHaveURL('/')
})

test('R7 chaque page a son propre titre d’onglet', async ({ page }) => {
  const pages = [
    { path: '/', title: "Accueil – Annabelle's Secrets" },
    { path: '/produits', title: "Boutique – Annabelle's Secrets" },
    { path: '/favoris', title: "Favoris – Annabelle's Secrets" },
    { path: '/newsletter', title: "Newsletter – Annabelle's Secrets" },
    { path: '/compte', title: "Mon compte – Annabelle's Secrets" },
  ]
  for (const { path, title } of pages) {
    await page.goto(path)
    await expect(page).toHaveTitle(title)
  }
})

test('R81 le lien « Femme » de l’en-tête ouvre la boutique déjà filtrée', async ({ page }) => {
  await page.goto('/')

  await page
    .getByRole('navigation', { name: 'Navigation principale' })
    .getByRole('link', { name: 'Femme' })
    .click()

  await expect(page).toHaveURL('/produits')
  await expect(page.getByText('20 résultats · Page 1 sur 2')).toBeVisible()
  await expect(page.getByRole('radio', { name: 'Femme' })).toBeChecked()
})

test.describe('sur mobile', () => {
  // A phone-sized window: the navigation is folded behind the burger button.
  test.use({ viewport: { width: 375, height: 800 } })

  test('R80 R81 le menu burger s’ouvre et mène aux goodies', async ({ page }) => {
    await page.goto('/')
    const burger = page.getByRole('button', { name: 'Ouvrir le menu' })
    await expect(burger).toHaveAttribute('aria-expanded', 'false')

    await burger.click()
    await expect(page.getByRole('button', { name: 'Fermer le menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await page.getByRole('link', { name: 'Goodies', exact: true }).filter({ visible: true }).click()

    await expect(page.getByText('5 résultats · Page 1 sur 1')).toBeVisible()
  })
})

test('R82 l’accueil montre les 4 mieux notés et les 5 goodies', async ({ page }) => {
  await page.goto('/')

  // A <section aria-labelledby="…"> is a "region" named after its heading.
  const topRated = page.getByRole('region', { name: 'Les mieux notés' })
  const goodies = page.getByRole('region', { name: 'Les goodies de la maison' })

  await expect(topRated.getByRole('button', { name: /^Favori : / })).toHaveCount(4)
  await expect(topRated.getByRole('link', { name: 'Onde Rosée' })).toBeVisible()
  await expect(goodies.getByRole('button', { name: /^Favori : / })).toHaveCount(5)
})
