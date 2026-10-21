import { useState } from 'react'
import { useDeleteProduct } from '../../hooks/useDeleteProduct'
import type { Product } from '../../types'
import { buttonClasses } from '../ui/buttonClasses'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { TrashIcon } from '../ui/icons'

type DeleteProductButtonProps = {
  product: Product
  label?: string
}

/** « Supprimer » + its confirmation dialog (R111). Used on the product page and the edit page. */
export function DeleteProductButton({ product, label = 'Supprimer' }: DeleteProductButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const { state, remove, reset } = useDeleteProduct(product)

  function close() {
    reset()
    setIsConfirming(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className={buttonClasses('danger')}
      >
        <TrashIcon />
        {label}
      </button>
      {isConfirming && (
        <ConfirmDialog
          title={`Supprimer « ${product.title} » ?`}
          message="Le produit disparaîtra de la boutique et de vos favoris. Cette action est définitive."
          confirmLabel={state.status === 'deleting' ? 'Suppression…' : 'Oui, supprimer'}
          onConfirm={() => void remove()}
          onCancel={close}
          isBusy={state.status === 'deleting'}
          error={state.status === 'error' ? state.message : undefined}
        />
      )}
    </>
  )
}
