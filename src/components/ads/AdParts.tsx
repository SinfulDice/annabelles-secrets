import { useAds } from '../../contexts/AdsContext'
import { CloseIcon } from '../ui/icons'

/** The pieces shared by the three ad formats. */

export function AdTag() {
  return (
    <span className="rounded-md bg-ink px-2.5 py-1 text-sm font-bold tracking-wider text-ad">
      PUB
    </span>
  )
}

/** The call to action is a button, never a link: it only starts the joke (R120, R126). */
export function AdCtaButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const { startGag } = useAds()
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        startGag()
      }}
      className="min-h-12 shrink-0 rounded-full bg-ad-border px-7 text-base font-bold text-white shadow-md hover:bg-ad-title sm:min-h-14 sm:text-lg"
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
  'rounded-panel border-4 border-dashed border-ad-border bg-ad p-5 text-ink sm:p-8'
