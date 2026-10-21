import { useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'

type ModalProps = {
  /** "alertdialog" for confirmations that need an answer (e.g. deleting). */
  role?: 'dialog' | 'alertdialog'
  labelledBy: string
  describedBy?: string
  initialFocusRef: RefObject<HTMLElement | null>
  /** Leave it out for a dialog that must not close with Escape (age check). */
  onEscape?: () => void
  children: ReactNode
}

export function Modal({
  role = 'dialog',
  labelledBy,
  describedBy,
  initialFocusRef,
  onEscape,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, initialFocusRef)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && onEscape) onEscape()
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/70 p-4">
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onKeyDown={handleKeyDown}
        className="w-full max-w-md rounded-panel bg-surface p-6 text-ink shadow-2xl sm:p-10"
      >
        {children}
      </div>
    </div>
  )
}
