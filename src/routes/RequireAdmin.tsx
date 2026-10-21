import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { buttonClasses } from '../components/ui/buttonClasses'
import { LockIcon } from '../components/ui/icons'
import { useAccount } from '../contexts/AccountContext'
import { usePageTitle } from '../hooks/usePageTitle'

function AdminOnly({ requestedPath }: { requestedPath: string }) {
  usePageTitle('Accès réservé')
  const signInPath = `/compte?retour=${encodeURIComponent(requestedPath)}`

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-femme-soft text-femme">
          <LockIcon />
        </span>
        <h1 className="text-3xl font-bold">Réservé à l&apos;administratrice</h1>
        <p className="text-ink-muted">
          Connectez-vous avec le compte admin pour ajouter, modifier ou supprimer des produits.
        </p>
        <Link to={signInPath} className={buttonClasses('primary')}>
          Se connecter
        </Link>
      </div>
    </div>
  )
}

/**
 * Guards admin pages (R106). It only hides the interface: everything runs in the browser,
 * so this is not real security (see the README limits).
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAccount()
  const { pathname } = useLocation()
  if (!isAdmin) return <AdminOnly requestedPath={pathname} />
  return children
}
