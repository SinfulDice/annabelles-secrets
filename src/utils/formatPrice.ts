// Created once and reused: building an Intl formatter is relatively costly.
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatPrice(amount: number): string {
  return euroFormatter.format(amount)
}
