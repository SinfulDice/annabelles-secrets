import { expect, test } from './fixtures'

test('R140 R142 s’abonner à la newsletter, puis se réabonner met à jour', async ({ page }) => {
  await page.goto('/newsletter')
  // Two forms on the page (subscribe / unsubscribe): we stay in the first one.
  const form = page.locator('form').first()

  await form.getByRole('textbox', { name: 'Prénom' }).fill('Pa')
  await form.getByRole('textbox', { name: /Adresse e-mail/ }).fill('pa@y.com')
  await form.getByRole('checkbox', { name: /J'ai 18 ans ou plus et j'accepte/ }).check()
  await form.getByRole('button', { name: "M'abonner" }).click()

  // R142: about 600 ms of fake network, then the confirmation.
  await expect(form.getByRole('status')).toContainText('Bienvenue Pa !')

  await form.getByRole('button', { name: "M'abonner" }).click()
  await expect(form.getByRole('status')).toContainText('Déjà inscrit·e.')
})
