import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionProducts } from '../contexts/SessionProductsContext'
import { isAbortError } from '../services/http'
import { createProduct } from '../services/productsApi'
import type { CreatedProductResponse, ProductFormValues } from '../types'
import { buildCreatedProduct, toProductPayload } from '../utils/createdProduct'

export type CreateProductState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'success'; response: CreatedProductResponse; productId: number }

/** Sends the form, then adds the created product to the shop (R73–R78). */
export function useCreateProduct() {
  const { mutations, addProduct } = useSessionProducts()
  const [state, setState] = useState<CreateProductState>({ status: 'idle' })
  // useRef: the controller must survive re-renders, but changing it must not cause one.
  const controllerRef = useRef<AbortController | null>(null)

  // Leaving the page during the request cancels it (cleanup on unmount).
  useEffect(() => () => controllerRef.current?.abort(), [])

  const submit = useCallback(
    async (values: ProductFormValues) => {
      const controller = new AbortController()
      controllerRef.current = controller
      setState({ status: 'submitting' })
      const payload = toProductPayload(values)

      try {
        const response = await createProduct(payload, controller.signal)
        // R78: two products created in this session never share an address.
        const usedIds = mutations.created.map((product) => product.id)
        const product = buildCreatedProduct(response, payload, usedIds)
        addProduct(product)
        setState({ status: 'success', response, productId: product.id })
      } catch (error) {
        if (isAbortError(error)) return
        const message = error instanceof Error ? error.message : "L'envoi a échoué."
        setState({ status: 'error', message })
      }
    },
    [mutations, addProduct],
  )

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, submit, reset }
}
