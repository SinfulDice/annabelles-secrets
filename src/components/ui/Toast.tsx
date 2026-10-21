import { useEffect } from 'react'
import { TOAST_DURATION_MS } from '../../constants/config'

export type ToastTone = 'success' | 'info' | 'error'

export type ToastMessage = {
  id: number
  message: string
  tone: ToastTone
}

// Dark toasts, as on mockup 04.
const toneClasses: Record<ToastTone, string> = {
  success: 'border-ink bg-ink text-on-accent',
  info: 'border-ink bg-ink text-on-accent',
  error: 'border-danger bg-danger text-on-accent',
}

type ToastItemProps = {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // Each toast closes itself; the cleanup cancels the timer if it is closed by hand first.
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <li
      className={`flex items-center gap-3 rounded-field border px-4 py-3 text-sm font-medium shadow-lg ${toneClasses[toast.tone]}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
        className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-on-accent/15"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  )
}

type ToastRegionProps = {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

/** Always in the page (even empty) so screen readers announce each new toast (role="status"). */
export function ToastRegion({ toasts, onDismiss }: ToastRegionProps) {
  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:w-96">
      <ul className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </ul>
    </div>
  )
}
