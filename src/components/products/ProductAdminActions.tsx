import { Link } from 'react-router'
import { useAccount } from '../../contexts/AccountContext'
import type { Product } from '../../types'
import { buttonClasses } from '../ui/buttonClasses'
import { PencilIcon } from '../ui/icons'
import { DeleteProductButton } from './DeleteProductButton'

/** Modifier / Supprimer on the product page, for the admin only (R106). */
export function ProductAdminActions({ product }: { product: Product }) {
  const { isAdmin } = useAccount()
  if (!isAdmin) return null

  return (
    <div className="flex flex-wrap gap-3">
      <Link to={`/produits/${product.id}/modifier`} className={buttonClasses('secondary')}>
        <PencilIcon />
        Modifier
      </Link>
      <DeleteProductButton product={product} />
    </div>
  )
}
