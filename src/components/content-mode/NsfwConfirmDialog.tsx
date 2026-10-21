import { useRef } from 'react'
import { buttonClasses } from '../ui/buttonClasses'
import { Modal } from '../ui/Modal'

type NsfwConfirmDialogProps = {
  onConfirm: () => void
  onCancel: () => void
}

/** Asked before switching to NSFW; the focus starts on the safe choice (R131). */
export function NsfwConfirmDialog({ onConfirm, onCancel }: NsfwConfirmDialogProps) {
  const stayRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal
      labelledBy="nsfw-title"
      describedBy="nsfw-description"
      initialFocusRef={stayRef}
      onEscape={onCancel}
    >
      <h2 id="nsfw-title" className="text-2xl font-bold">
        Afficher les photos réelles ?
      </h2>
      <p id="nsfw-description" className="mt-3 text-ink-muted">
        Ce mode montre les produits tels qu&apos;ils sont. Les photos restent floutées tant que vous
        ne cliquez pas sur « Afficher ». À éviter au bureau ou dans les transports.
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          ref={stayRef}
          type="button"
          onClick={onCancel}
          className={buttonClasses('secondary')}
        >
          Rester en SFW
        </button>
        <button type="button" onClick={onConfirm} className={buttonClasses('alarm')}>
          Passer en NSFW
        </button>
      </div>
    </Modal>
  )
}
