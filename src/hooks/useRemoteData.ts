import { useCallback, useEffect, useMemo, useState } from 'react'
import { HttpError, httpRequest, isAbortError, NETWORK_ERROR_STATUS } from '../services/http'

/**
 * One status at a time (a "discriminated union", R14): `data` only exists on success and
 * `error` only on error, and TypeScript checks it.
 * `previous`: while a new page loads, the last data received, to keep it on screen (R41).
 */
export type RemoteData<T> =
  | { status: 'loading'; previous: T | null }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; httpStatus: number }

type Outcome<T> = Exclude<RemoteData<T>, { status: 'loading' }>

function toErrorOutcome(error: unknown): Outcome<never> {
  return {
    status: 'error',
    error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue.',
    httpStatus: error instanceof HttpError ? error.status : NETWORK_ERROR_STATUS,
  }
}

/**
 * GETs `path` from our API, again each time `path` changes (R19), and each time `retry` is
 * called. `null` = nothing to load. Used for a page of products, one product, the catalogue.
 */
export function useRemoteData<T>(path: string | null) {
  // Changing this number changes requestKey, which re-runs the effect: that is « Réessayer ».
  const [attempt, setAttempt] = useState(0)
  const requestKey = path === null ? null : `${path}#${attempt}`
  // The last answer, labelled with the request it answers.
  const [result, setResult] = useState<{ key: string; outcome: Outcome<T> } | null>(null)

  useEffect(() => {
    if (path === null || requestKey === null) return
    const controller = new AbortController()

    httpRequest<T>(path, { signal: controller.signal })
      .then((data) => setResult({ key: requestKey, outcome: { status: 'success', data } }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setResult({ key: requestKey, outcome: toErrorOutcome(error) })
      })

    // Cleanup (R13, R19): the criteria changed or the page closed before the answer: cancel,
    // so an old answer can never replace a newer one.
    return () => controller.abort()
  }, [path, requestKey])

  const retry = useCallback(() => setAttempt((previous) => previous + 1), [])

  // Computed, not stored: "loading" simply means "the last answer is for another request".
  // useMemo keeps the same object between renders, for the contexts that share it.
  const state = useMemo<RemoteData<T>>(() => {
    if (result !== null && result.key === requestKey) return result.outcome
    const previous = result?.outcome.status === 'success' ? result.outcome.data : null
    return { status: 'loading', previous }
  }, [result, requestKey])

  return { state, retry }
}
