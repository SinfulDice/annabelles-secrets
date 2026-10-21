import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ToastRegion, type ToastMessage, type ToastTone } from '../components/ui/Toast'

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  // useRef keeps a counter between renders without causing a re-render when it changes.
  const nextId = useRef(0)

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    nextId.current += 1
    const toast = { id: nextId.current, message, tone }
    setToasts((previous) => [...previous, toast])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext value={value}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
    </ToastContext>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast doit être utilisé dans <ToastProvider>.')
  }
  return context
}
