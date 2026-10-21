import { useContentMode } from '../../contexts/ContentModeContext'

/** Reminder at the top of every page while NSFW is on (mockup 12). */
export function NsfwNotice() {
  const { mode, revealAll, disableNsfw } = useContentMode()
  if (mode !== 'nsfw') return null

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-panel bg-danger-soft px-5 py-4 text-danger">
        <p>
          <strong>Mode NSFW activé.</strong> Images explicites floutées par défaut.
        </p>
        <button
          type="button"
          onClick={revealAll}
          className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-ink-muted"
        >
          Tout afficher
        </button>
        <button
          type="button"
          onClick={disableNsfw}
          className="min-h-11 text-sm font-semibold underline underline-offset-4"
        >
          Revenir en SFW
        </button>
      </div>
    </div>
  )
}
