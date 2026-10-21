import type { Product } from '../types'

export type ProductSpec = {
  label: string
  value: string
}

const decimalFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })
const formatNumber = (value: number) => decimalFormatter.format(value)

/**
 * The « Caractéristiques » table (R50). Fields that don't apply are left out instead of
 * showing "null" (R52): no battery life for a ring without battery, sizes only for clothes.
 */
export function getProductSpecs(product: Product): ProductSpec[] {
  const { width, height, depth } = product.dimensions
  const specs: ProductSpec[] = []

  // A created product may not know its material, size or weight (R79): hide them.
  if (product.material !== '') specs.push({ label: 'Matériau', value: product.material })
  if (width > 0 && height > 0 && depth > 0) {
    specs.push({
      label: 'Dimensions',
      value: `${formatNumber(height)} × ${formatNumber(width)} × ${formatNumber(depth)} cm`,
    })
  }
  if (product.weight > 0) specs.push({ label: 'Poids', value: `${formatNumber(product.weight)} g` })
  specs.push({ label: 'Étanchéité', value: product.waterproof ? 'Étanche' : 'Non étanche' })

  if (product.batteryLife !== null) {
    specs.push({ label: 'Autonomie', value: `${product.batteryLife} min` })
  }
  if (product.noiseLevel !== null) {
    specs.push({ label: 'Niveau sonore', value: `${product.noiseLevel} dB` })
  }
  if (product.sizes && product.sizes.length > 0) {
    specs.push({ label: 'Tailles disponibles', value: product.sizes.join(', ') })
  }

  specs.push(
    { label: 'Garantie', value: product.warrantyInformation },
    { label: 'Expédition', value: product.shippingInformation },
    { label: 'Retour', value: product.returnPolicy },
  )
  return specs
}
