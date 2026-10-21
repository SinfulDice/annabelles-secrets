import { Link } from 'react-router'
import type { Account } from '../../types'
import { buttonClasses } from '../ui/buttonClasses'
import { PlusIcon } from '../ui/icons'
import { ProfileHeader } from './ProfileHeader'
import { ProfileRows } from './ProfileRows'

type AdminProfileProps = {
  account: Account
  onSignOut: () => void
}

/** The pre-created admin account (R100): no edit, no delete. */
export function AdminProfile({ account, onSignOut }: AdminProfileProps) {
  return (
    <section className="flex flex-col gap-5 rounded-panel border-2 border-ink bg-surface p-5 sm:p-8">
      <ProfileHeader
        account={account}
        subtitle={
          <span className="rounded-full bg-ad px-2 py-0.5 text-xs font-bold text-ink">
            Propriétaire · admin
          </span>
        }
      />
      <ProfileRows
        rows={[
          { label: 'E-mail', value: account.email },
          { label: 'Droits', value: 'Créer, modifier, supprimer des produits' },
        ]}
        password={account.password}
      />
      <div className="flex flex-wrap gap-3">
        <Link to="/produits/nouveau" className={buttonClasses('primary')}>
          <PlusIcon />
          Ajouter un produit
        </Link>
        <button type="button" onClick={onSignOut} className={buttonClasses('secondary')}>
          Se déconnecter
        </button>
      </div>
      <p className="text-xs text-ink-muted">
        Ce compte existe dès le premier lancement (identifiants dans le README). Il ne peut pas être
        supprimé depuis l&apos;interface.
      </p>
    </section>
  )
}
