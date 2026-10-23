import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { SHOP_PATH } from '../constants/navigation'
import { useAccount } from '../contexts/AccountContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useSessionProducts } from '../contexts/SessionProductsContext'
import { useToast } from '../contexts/ToastContext'
import { isAbortError } from '../services/http'
import { deleteProduct } from '../services/productsApi'
import type { Product } from '../types'

export type DeleteProductState =
  { status: 'idle' } | { status: 'deleting' } | { status: 'error'; message: string }

/** DELETE, then removes the product from the shop and the favorites, toast, back to /produits. */
export function useDeleteProduct(product: Product) {
  const { isAdmin } = useAccount()
  const { removeProduct } = useSessionProducts()
  const { forgetProduct } = useFavorites()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [state, setState] = useState<DeleteProductState>({ status: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const remove = useCallback(async () => {
    // R106: the role is checked again here, not only by hiding the button.
    if (!isAdmin) {
      setState({ status: 'error', message: "Seule l'administratrice peut supprimer un produit." })
      return
    }
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ status: 'deleting' })

    try {
      if (!product.isLocal) await deleteProduct(product.id, controller.signal)
      // Leave the page first: removing the product while still on it would flash
      // « Produit introuvable » for a moment.
      await navigate(SHOP_PATH)
      removeProduct(product.id)
      forgetProduct(product.id)
      showToast(`« ${product.title} » a été supprimé.`)
    } catch (error) {
      if (isAbortError(error)) return
      const message = error instanceof Error ? error.message : 'La suppression a échoué.'
      setState({ status: 'error', message })
    }
  }, [isAdmin, product, removeProduct, forgetProduct, showToast, navigate])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, remove, reset }
}
