type PasswordToggleProps = {
  isVisible: boolean
  onToggle: () => void
  /** Which password it shows, for screen readers ("le mot de passe", "la confirmation"). */
  target: string
}

/** « Afficher / Masquer » button placed inside a password field. */
export function PasswordToggle({ isVisible, onToggle, target }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isVisible}
      aria-label={`Afficher ${target}`}
      className="min-h-9 rounded-full px-3 text-sm font-semibold hover:bg-page"
    >
      {isVisible ? 'Masquer' : 'Afficher'}
    </button>
  )
}
