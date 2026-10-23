import { expect, test } from './fixtures'

test('R101 un visiteur crée un compte et s’abonne à la newsletter', async ({ page }) => {
  await page.goto('/compte')
  await page.getByRole('tab', { name: 'Créer un compte' }).click()

  // fill() already clicks the field, no need for click() before.
  await page.getByRole('textbox', { name: 'Prénom (obligatoire)' }).fill('Pa')
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('pa')
  await page.getByRole('textbox', { name: 'Adresse e-mail (obligatoire)' }).fill('pa@y.com')
  await page
    .getByRole('textbox', { name: 'Mot de passe (obligatoire)', exact: true })
    .fill('Azerty123')
  await page.getByRole('textbox', { name: /Confirmer le mot de passe/ }).fill('Azerty123')
  await page.getByRole('textbox', { name: /Date de naissance/ }).fill('2006-10-12')
  await page.getByRole('checkbox', { name: /M'abonner aussi à la newsletter/ }).check()
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await expect(page.getByRole('status')).toContainText('Vous êtes connecté·e')
  await expect(page.getByRole('link', { name: 'Mon compte : Pa pa' })).toBeVisible()
  // exact: true → only the profile row, not the JSON preview that also contains the e-mail.
  await expect(page.getByText('pa@y.com', { exact: true })).toBeVisible()
  // ^ = "starts with" and case-sensitive, so "Non abonné·e" does not match.
  await expect(page.getByText(/^Abonné·e/)).toBeVisible()
})

test('R102 un mauvais mot de passe donne un message générique', async ({ page }) => {
  await page.goto('/compte')

  // The admin account exists from the first visit (R100): the e-mail is right, the password not.
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('admin@annabelles-secrets.fr')
  await page
    .getByRole('textbox', { name: 'Mot de passe', exact: true })
    .fill('mauvais-mot-de-passe')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  // Same message whether the e-mail exists or not: it gives no clue to an attacker.
  await expect(page.getByRole('alert')).toHaveText(
    'E-mail ou mot de passe incorrect. Vérifiez vos informations.',
  )
  await expect(page.getByRole('link', { name: 'Mon compte (non connecté)' })).toBeVisible()
})

test('R101 une personne de moins de 18 ans ne peut pas créer de compte', async ({ page }) => {
  await page.goto('/compte')
  await page.getByRole('tab', { name: 'Créer un compte' }).click()

  await page.getByRole('textbox', { name: 'Prénom (obligatoire)' }).fill('Léa')
  await page.getByRole('textbox', { name: 'Adresse e-mail (obligatoire)' }).fill('lea@y.com')
  await page
    .getByRole('textbox', { name: 'Mot de passe (obligatoire)', exact: true })
    .fill('Azerty123')
  await page.getByRole('textbox', { name: /Confirmer le mot de passe/ }).fill('Azerty123')
  await page.getByRole('textbox', { name: /Date de naissance/ }).fill('2015-06-01')
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await expect(
    page.getByText('Vous devez avoir au moins 18 ans pour créer un compte.').first(),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Mon compte (non connecté)' })).toBeVisible()
})

test('R102 R103 se déconnecter, se reconnecter, puis supprimer son compte', async ({ page }) => {
  await page.goto('/compte')
  await page.getByRole('tab', { name: 'Créer un compte' }).click()
  await page.getByRole('textbox', { name: 'Prénom (obligatoire)' }).fill('Sam')
  await page.getByRole('textbox', { name: 'Adresse e-mail (obligatoire)' }).fill('sam@y.com')
  await page
    .getByRole('textbox', { name: 'Mot de passe (obligatoire)', exact: true })
    .fill('Azerty123')
  await page.getByRole('textbox', { name: /Confirmer le mot de passe/ }).fill('Azerty123')
  await page.getByRole('textbox', { name: /Date de naissance/ }).fill('1999-01-01')
  await page.getByRole('button', { name: 'Créer mon compte' }).click()

  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await expect(page.getByRole('link', { name: 'Mon compte (non connecté)' })).toBeVisible()

  // The account is still stored: the same e-mail and password work again (R102).
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('sam@y.com')
  await page.getByRole('textbox', { name: 'Mot de passe', exact: true }).fill('Azerty123')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('link', { name: /^Mon compte : Sam/ })).toBeVisible()

  // Deleting asks for confirmation first, with the focus on the safe choice.
  await page.getByRole('button', { name: 'Supprimer mon compte' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Supprimer votre compte ?' })
  await expect(dialog.getByRole('button', { name: 'Annuler' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Supprimer mon compte' }).click()

  await expect(page.getByRole('status')).toContainText('Votre compte a été supprimé')
  await expect(page.getByRole('link', { name: 'Mon compte (non connecté)' })).toBeVisible()
})
