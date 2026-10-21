import { useToast } from '../../contexts/ToastContext'
import { CloseIcon } from '../ui/icons'

/** The pieces shared by the three ad formats. */

export function AdTag() {
  return (
    <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-bold tracking-wider text-ad">
      PUB
    </span>
  )
}

/** The call to action is a button, never a link: there is nowhere to go (R120, R124). */
export function AdCtaButton({ label }: { label: string }) {
  const { showToast } = useToast()
  return (
    <button
      type="button"
      onClick={() => showToast("C'était une fausse pub 😉", 'info')}
      className="min-h-11 shrink-0 rounded-full bg-ad-border px-5 text-sm font-bold text-white hover:bg-ad-title"
    >
      {label}
    </button>
  )
}

export function AdCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fermer la publicité"
      className="grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-ink/10"
    >
      <CloseIcon />
    </button>
  )
}

export function AdCaption() {
  return (
    <p className="mt-1.5 text-xs text-ink-muted">
      Publicité parodique · le message change aléatoirement · aucun lien réel
    </p>
  )
}

/** Yellow box with the dotted red border of the mockup. */
export const adBoxClasses =
  'rounded-card border-3 border-dashed border-ad-border bg-ad p-4 text-ink sm:p-5'
