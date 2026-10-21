import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AdFormat } from '../types'

type AdsContextValue = {
  isDismissed: (format: AdFormat) => boolean
  dismiss: (format: AdFormat) => void
}

const AdsContext = createContext<AdsContextValue | null>(null)

/**
 * Remembers which ad formats were closed with « × » (R124). Plain state, not localStorage:
 * a closed ad stays hidden while browsing, and comes back on the next reload.
 */
export function AdsProvider({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState<AdFormat[]>([])

  const isDismissed = useCallback((format: AdFormat) => dismissed.includes(format), [dismissed])
  const dismiss = useCallback(
    (format: AdFormat) => setDismissed((previous) => [...previous, format]),
    [],
  )

  const value = useMemo(() => ({ isDismissed, dismiss }), [isDismissed, dismiss])
  return <AdsContext value={value}>{children}</AdsContext>
}

export function useAds(): AdsContextValue {
  const context = useContext(AdsContext)
  if (!context) {
    throw new Error('useAds doit être utilisé dans <AdsProvider>.')
  }
  return context
}
