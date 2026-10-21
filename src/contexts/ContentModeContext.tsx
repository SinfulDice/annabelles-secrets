import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { ContentMode } from '../types'
import { parseContentMode } from '../utils/productImages'
import { initialRevealState, isRevealedIn, revealReducer } from '../utils/revealState'
import { useAgeGate } from './AgeGateContext'

type ContentModeContextValue = {
  /** Always 'sfw' until the age check is passed (R131). */
  mode: ContentMode
  enableNsfw: () => void
  disableNsfw: () => void
  /** Explicit images start blurred; a product is "revealed" once its image was shown (R132). */
  isRevealed: (productId: number) => boolean
  reveal: (productId: number) => void
  hide: (productId: number) => void
  revealAll: () => void
}

const ContentModeContext = createContext<ContentModeContextValue | null>(null)

export function ContentModeProvider({ children }: { children: ReactNode }) {
  const { isAgeConfirmed } = useAgeGate()
  const [savedMode, setSavedMode] = useLocalStorage(STORAGE_KEYS.contentMode, parseContentMode)
  // Not saved: after a reload, every explicit image is blurred again. Tested reducer.
  const [revealState, dispatch] = useReducer(revealReducer, initialRevealState)

  const mode: ContentMode = isAgeConfirmed ? savedMode : 'sfw'

  const enableNsfw = useCallback(() => setSavedMode('nsfw'), [setSavedMode])
  const disableNsfw = useCallback(() => {
    setSavedMode('sfw')
    dispatch({ type: 'reset' })
  }, [setSavedMode])

  const isRevealed = useCallback(
    (productId: number) => isRevealedIn(revealState, productId),
    [revealState],
  )
  const reveal = useCallback((id: number) => dispatch({ type: 'revealed', id }), [])
  const hide = useCallback((id: number) => dispatch({ type: 'hidden', id }), [])
  const revealAll = useCallback(() => dispatch({ type: 'allRevealed' }), [])

  const value = useMemo(
    () => ({ mode, enableNsfw, disableNsfw, isRevealed, reveal, hide, revealAll }),
    [mode, enableNsfw, disableNsfw, isRevealed, reveal, hide, revealAll],
  )
  return <ContentModeContext value={value}>{children}</ContentModeContext>
}

export function useContentMode(): ContentModeContextValue {
  const context = useContext(ContentModeContext)
  if (!context) {
    throw new Error('useContentMode doit être utilisé dans <ContentModeProvider>.')
  }
  return context
}
