import { useEffect, useRef, useState } from 'react'
import { AD_POPUP_CLOSE_DELAY_S, AD_POPUP_DELAY_MS } from '../../constants/ads'
import { STORAGE_KEYS } from '../../constants/config'
import { useAgeGate } from '../../contexts/AgeGateContext'
import { useRandomAd } from '../../hooks/useRandomAd'
import { readSessionFlag, writeSessionFlag } from '../../utils/sessionFlag'
import { Modal } from '../ui/Modal'
import { AdCtaButton, AdTag } from './AdParts'

const ONE_SECOND_MS = 1000

function PopupDialog({ onClose }: { onClose: () => void }) {
  const ad = useRandomAd()
  const [secondsLeft, setSecondsLeft] = useState(AD_POPUP_CLOSE_DELAY_S)
  const contentRef = useRef<HTMLDivElement>(null)
  const canClose = secondsLeft === 0

  // Countdown: one timeout per second, until 0. Each new value of secondsLeft re-runs the
  // effect, and the cleanup cancels the pending timeout if the pop-up closes first.
  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = window.setTimeout(() => setSecondsLeft((left) => left - 1), ONE_SECOND_MS)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  return (
    <Modal
      labelledBy="ad-popup-title"
      initialFocusRef={contentRef}
      onEscape={canClose ? onClose : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className="-m-6 flex flex-col items-center gap-4 rounded-panel border-3 border-ad-border bg-ad p-8 text-center text-ink outline-none sm:-m-10"
      >
        <AdTag />
        <p
          id="ad-popup-title"
          className="font-display text-3xl leading-tight font-bold text-ad-title sm:text-4xl"
        >
          {ad.title}
        </p>
        <p className="text-lg">{ad.subtitle}</p>
        {/* The pop-up closes first: its focus trap would make the joke unreachable by keyboard. */}
        <AdCtaButton label={ad.cta} onClick={onClose} />
        <button
          type="button"
          onClick={onClose}
          disabled={!canClose}
          className="min-h-11 rounded-full px-4 text-sm font-semibold text-ink-muted enabled:text-ink enabled:underline disabled:cursor-not-allowed"
        >
          {canClose ? 'Fermer la publicité' : `Fermer dans ${secondsLeft} s`}
        </button>
        <p className="text-xs text-ink-muted">Publicité parodique · aucun lien réel</p>
      </div>
    </Modal>
  )
}

/** Once per session, 20 s after arriving (and after the age check), can be closed after 3 s (R123). */
export function AdPopup() {
  const { isAgeConfirmed } = useAgeGate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isAgeConfirmed || readSessionFlag(STORAGE_KEYS.adPopupShown)) return
    const timer = window.setTimeout(() => {
      writeSessionFlag(STORAGE_KEYS.adPopupShown)
      setIsOpen(true)
    }, AD_POPUP_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [isAgeConfirmed])

  if (!isOpen) return null
  return <PopupDialog onClose={() => setIsOpen(false)} />
}
