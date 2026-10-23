import { useCallback, useEffect, useRef, useState } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useSessionProducts } from '../contexts/SessionProductsContext'
import { isAbortError } from '../services/http'
import { updateProduct as putProduct } from '../services/productsApi'
import type { Product, ProductFormValues } from '../types'
import { toProductPayload } from '../utils/createdProduct'
import { describeChanges, toProductChanges } from '../utils/productEdit'

export type EditProductState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'success'; summary: string }

/** Saves the edit form with PUT, then updates the shop and the favorites (R110, R112). */
export function useEditProduct(product: Product) {
  const { updateProduct } = useSessionProducts()
  const { refreshFavorite } = useFavorites()
  const [state, setState] = useState<EditProductState>({ status: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const submit = useCallback(
    async (values: ProductFormValues) => {
      const controller = new AbortController()
      controllerRef.current = controller
      setState({ status: 'submitting' })

      try {
        // R112: DummyJSON does not know products created here (PUT would answer 404).
        if (!product.isLocal) {
          await putProduct(product.id, toProductPayload(values), controller.signal)
        }
        const changes = toProductChanges(values, product)
        updateProduct(product.id, changes)
        refreshFavorite({ ...product, ...changes })
        setState({ status: 'success', summary: describeChanges(product, changes) })
      } catch (error) {
        if (isAbortError(error)) return
        const message = error instanceof Error ? error.message : "L'enregistrement a échoué."
        setState({ status: 'error', message })
      }
    },
    [product, updateProduct, refreshFavorite],
  )

  return { state, submit }
}
