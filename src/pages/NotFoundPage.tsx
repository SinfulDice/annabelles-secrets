import { Link } from 'react-router'
import { buttonClasses } from '../components/ui/buttonClasses'
import { usePageTitle } from '../hooks/usePageTitle'

/** Shown for any unknown address (R8). */
export function NotFoundPage() {
  usePageTitle('Page introuvable')

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-femme">404</p>
      <h1 className="text-3xl font-bold">Cette page n&apos;existe pas</h1>
      <p className="text-ink-muted">
        L&apos;adresse est peut-être mal saisie, ou la page a été déplacée.
      </p>
      <Link to="/" className={buttonClasses('primary')}>
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
