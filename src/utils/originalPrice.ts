/**
 * Price before the discount, rounded to the cent, or null when there is no discount.
 * `price` is what the customer pays: 89 € with 10 % off was 89 / 0.9 = 98.89 €.
 */
export function getOriginalPrice(price: number, discountPercentage: number): number | null {
  if (discountPercentage <= 0) return null
  return Math.round((price / (1 - discountPercentage / 100)) * 100) / 100
}
