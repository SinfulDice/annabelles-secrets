import { useState } from 'react'
import { useContentMode } from '../../contexts/ContentModeContext'
import { useToast } from '../../contexts/ToastContext'
import { NsfwConfirmDialog } from './NsfwConfirmDialog'

/** « ● SFW » / « ● NSFW » pill of the header (R130, R131). */
export function ContentModeToggle({ className = '' }: { className?: string }) {
  const { mode, enableNsfw, disableNsfw } = useContentMode()
  const { showToast } = useToast()
  const [isConfirming, setIsConfirming] = useState(false)
  const isNsfw = mode === 'nsfw'

  function handleClick() {
    if (!isNsfw) {
      setIsConfirming(true)
      return
    }
    disableNsfw()
    showToast('Retour en mode SFW', 'info')
  }

  function confirm() {
    enableNsfw()
    setIsConfirming(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={isNsfw ? 'Mode NSFW activé. Revenir en SFW' : 'Mode SFW activé. Passer en NSFW'}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold ${isNsfw ? 'border-danger bg-danger text-white' : 'border-line bg-surface text-ink hover:border-ink-muted'} ${className}`}
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${isNsfw ? 'bg-white' : 'bg-success'}`}
        />
        {isNsfw ? 'NSFW' : 'SFW'}
      </button>
      {isConfirming && (
        <NsfwConfirmDialog onConfirm={confirm} onCancel={() => setIsConfirming(false)} />
      )}
    </>
  )
}
