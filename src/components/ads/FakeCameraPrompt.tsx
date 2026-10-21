import { useEffect, useRef } from 'react'
import { CameraIcon, CloseIcon } from '../ui/icons'

type FakeCameraPromptProps = {
  /** Same result whatever the answer: the joke goes on (R126). */
  onAnswer: () => void
}

const browserButton = 'min-h-9 rounded-full px-4 text-[13px] font-medium'

/**
 * Looks like the camera permission bubble of a browser (Chrome style: top left, system font,
 * blue buttons). It is FAKE: nothing here calls navigator.mediaDevices, the camera is never
 * touched. Any answer just leads to the GIF.
 */
export function FakeCameraPrompt({ onAnswer }: FakeCameraPromptProps) {
  const blockRef = useRef<HTMLButtonElement>(null)

  // Focus the safe answer, and let Escape answer "Bloquer", like a real browser.
  useEffect(() => {
    blockRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onAnswer()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onAnswer])

  return (
    <div
      role="dialog"
      aria-labelledby="fake-camera-title"
      aria-describedby="fake-camera-request"
      className="fixed top-2 left-2 z-50 w-[min(21rem,calc(100vw-1rem))] rounded-xl border border-black/10 bg-white p-4 font-[system-ui] text-[13px] text-[#1f1f1f] shadow-[0_6px_24px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p id="fake-camera-title" className="pt-1 text-sm">
          <strong className="font-medium">{window.location.host}</strong> souhaite
        </p>
        <button
          type="button"
          onClick={onAnswer}
          aria-label="Fermer"
          className="grid size-8 place-items-center rounded-full hover:bg-black/5"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
      <p id="fake-camera-request" className="mt-3 flex items-center gap-3">
        <CameraIcon className="size-5 text-[#444746]" />
        Utiliser vos caméras
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          ref={blockRef}
          type="button"
          onClick={onAnswer}
          className={`${browserButton} border border-[#747775] text-[#0b57d0] hover:bg-[#0b57d0]/5`}
        >
          Bloquer
        </button>
        <button
          type="button"
          onClick={onAnswer}
          className={`${browserButton} bg-[#0b57d0] text-white hover:bg-[#0842a0]`}
        >
          Autoriser
        </button>
      </div>
    </div>
  )
}
