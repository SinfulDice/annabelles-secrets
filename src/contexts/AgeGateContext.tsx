import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'

type AgeGateContextValue = {
  isAgeConfirmed: boolean
  confirmAge: () => void
}

const AgeGateContext = createContext<AgeGateContextValue | null>(null)

const isTrue = (stored: unknown) => stored === true

/**
 * The 18+ answer (R87), shared because several parts depend on it: the age dialog itself,
 * the parody ads (R125) and the NSFW mode (R131).
 */
export function AgeGateProvider({ children }: { children: ReactNode }) {
  const [isAgeConfirmed, setIsAgeConfirmed] = useLocalStorage(STORAGE_KEYS.ageConfirmed, isTrue)
  const confirmAge = useCallback(() => setIsAgeConfirmed(true), [setIsAgeConfirmed])
  const value = useMemo(() => ({ isAgeConfirmed, confirmAge }), [isAgeConfirmed, confirmAge])
  return <AgeGateContext value={value}>{children}</AgeGateContext>
}

export function useAgeGate(): AgeGateContextValue {
  const context = useContext(AgeGateContext)
  if (!context) {
    throw new Error('useAgeGate doit être utilisé dans <AgeGateProvider>.')
  }
  return context
}
