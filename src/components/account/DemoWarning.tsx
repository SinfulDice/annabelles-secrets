import { WarningIcon } from '../ui/icons'

/** Always visible on the account page (R104): this account system is a demo. */
export function DemoWarning() {
  return (
    <p className="flex gap-3 rounded-card border border-warning-ink/30 bg-warning-soft p-4 text-sm text-warning-ink">
      <WarningIcon />
      <span>
        <strong>Compte de démonstration.</strong> Tout est enregistré dans ce navigateur, mot de
        passe en clair. N&apos;utilisez jamais un vrai mot de passe ici.
      </span>
    </p>
  )
}
