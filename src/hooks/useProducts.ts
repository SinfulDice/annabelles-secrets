import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../services/http'
import { fetchProducts } from '../services/productsApi'
import type { Product } from '../types'

/**
 * One status at a time (a "discriminated union"): with three booleans (isLoading, isError…)
 * impossible mixes like "loading AND error" could exist. Here `products` only exists on
 * success and `error` only on error, and TypeScript checks it.
 */
export type ProductsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; error: string }

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'
}

/** Loads the product list once, and again each time `retry` is called. */
export function useProducts() {
  // 'idle' only lasts for the first render: the effect below starts the request right after.
  const [state, setState] = useState<ProductsState>({ status: 'idle' })
  // Changing this number re-runs the effect, which is how "Réessayer" restarts the request.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(controller.signal)
      .then((products) => setState({ status: 'success', products }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState({ status: 'error', error: toErrorMessage(error) })
      })

    // Cleanup: if the component disappears (or retries) before the answer, cancel the request.
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((previous) => previous + 1)
  }, [])

  return { state, retry }
}
