import { useRef } from 'react'
import { AD_GAG_GIF_ALT, AD_GAG_GIF_URL } from '../../constants/ads'
import { useAds } from '../../contexts/AdsContext'
import { buttonClasses } from '../ui/buttonClasses'
import { Modal } from '../ui/Modal'
import { FakeCameraPrompt } from './FakeCameraPrompt'

function GifDialog({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal labelledBy="ad-gag-title" initialFocusRef={closeRef} onEscape={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">
        {AD_GAG_GIF_URL && (
          <img src={AD_GAG_GIF_URL} alt={AD_GAG_GIF_ALT} className="w-full rounded-card" />
        )}
        <h2 id="ad-gag-title" className="text-3xl font-bold">
          C&apos;était une fausse pub 😉
        </h2>
        {/* Says it plainly, for anyone who clicked « Autoriser » and is now worried. */}
        <p className="text-ink-muted">
          Et la demande de caméra aussi : aucune caméra n&apos;a été activée.
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={buttonClasses('primary')}>
          Bien joué, fermer
        </button>
      </div>
    </Modal>
  )
}

/** The joke after a click on an ad button (R126): fake camera request, then the GIF. */
export function AdGag() {
  const { gagStage, answerPermission, closeGag } = useAds()
  if (gagStage === 'permission') return <FakeCameraPrompt onAnswer={answerPermission} />
  if (gagStage === 'gif') return <GifDialog onClose={closeGag} />
  return null
}
