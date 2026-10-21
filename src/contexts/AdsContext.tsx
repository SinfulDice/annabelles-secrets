import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import type { AdFormat } from '../types'
import { nextGagStage, type GagStage } from '../utils/adGag'

type AdsContextValue = {
  isDismissed: (format: AdFormat) => boolean
  dismiss: (format: AdFormat) => void
  /** Where the joke played after a click on an ad button is (R126). */
  gagStage: GagStage
  startGag: () => void
  answerPermission: () => void
  closeGag: () => void
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

  // A reducer here too: the pure function nextGagStage (tested) decides each next step.
  const [gagStage, sendGagEvent] = useReducer(nextGagStage, 'idle')
  const startGag = useCallback(() => sendGagEvent('adClicked'), [])
  const answerPermission = useCallback(() => sendGagEvent('permissionAnswered'), [])
  const closeGag = useCallback(() => sendGagEvent('gifClosed'), [])

  const value = useMemo(
    () => ({ isDismissed, dismiss, gagStage, startGag, answerPermission, closeGag }),
    [isDismissed, dismiss, gagStage, startGag, answerPermission, closeGag],
  )
  return <AdsContext value={value}>{children}</AdsContext>
}

export function useAds(): AdsContextValue {
  const context = useContext(AdsContext)
  if (!context) {
    throw new Error('useAds doit être utilisé dans <AdsProvider>.')
  }
  return context
}
