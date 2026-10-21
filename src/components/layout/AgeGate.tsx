import { useRef } from 'react'
import { AGE_GATE_EXIT_URL } from '../../constants/config'
import { buttonClasses } from '../ui/buttonClasses'
import { Modal } from '../ui/Modal'
import { Logo } from './Logo'

type AgeGateProps = {
  onConfirm: () => void
}

/** Blocking dialog (R87): no Escape, no close button, only the two answers. */
export function AgeGate({ onConfirm }: AgeGateProps) {
  const enterButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal
      labelledBy="age-gate-title"
      describedBy="age-gate-description"
      initialFocusRef={enterButtonRef}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo />
        <p
          aria-hidden="true"
          className="grid size-16 place-items-center rounded-full bg-femme-soft font-display text-xl font-bold text-femme"
        >
          18+
        </p>
        <h2 id="age-gate-title" className="text-2xl font-bold sm:text-3xl">
          Ce site est réservé aux personnes majeures
        </h2>
        <p id="age-gate-description" className="text-ink-muted">
          Annabelle&apos;s Secrets présente des produits de bien-être intime. Confirmez que vous
          avez 18 ans ou plus pour continuer.
        </p>
        <div className="flex w-full flex-col gap-3">
          <button
            ref={enterButtonRef}
            type="button"
            onClick={onConfirm}
            className={buttonClasses('primary')}
          >
            J&apos;ai 18 ans ou plus — Entrer
          </button>
          <button
            type="button"
            onClick={() => window.location.assign(AGE_GATE_EXIT_URL)}
            className={buttonClasses('secondary')}
          >
            J&apos;ai moins de 18 ans — Quitter
          </button>
        </div>
        <p className="text-xs text-ink-muted">Votre choix est mémorisé sur cet appareil.</p>
      </div>
    </Modal>
  )
}
