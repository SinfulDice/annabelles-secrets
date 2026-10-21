import { useRef } from 'react'
import { buttonClasses } from './buttonClasses'
import { Modal } from './Modal'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** Disables both buttons while the action runs (e.g. a DELETE request). */
  isBusy?: boolean
}

/**
 * "Are you sure?" dialog for destructive actions: role="alertdialog", the focus starts on
 * « Annuler » (the safe choice) and Escape cancels.
 */
export function ConfirmDialog(props: ConfirmDialogProps) {
  const { title, message, confirmLabel, onConfirm, onCancel, isBusy = false } = props
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal
      role="alertdialog"
      labelledBy="confirm-title"
      describedBy="confirm-message"
      initialFocusRef={cancelRef}
      onEscape={isBusy ? undefined : onCancel}
    >
      <h2 id="confirm-title" className="text-2xl font-bold">
        {title}
      </h2>
      <p id="confirm-message" className="mt-3 text-ink-muted">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className={buttonClasses('secondary')}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isBusy}
          className={buttonClasses('danger')}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
