import { useState } from 'react'
import { Link } from 'react-router'
import { useAccount } from '../../contexts/AccountContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import type { Account } from '../../types'
import { formatLongDate, formatNumericDate } from '../../utils/formatDate'
import { formatCount } from '../../utils/formatRating'
import { buttonClasses } from '../ui/buttonClasses'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { AccountForm } from './AccountForm'
import { ProfileHeader } from './ProfileHeader'
import { ProfileRows } from './ProfileRows'

type CustomerProfileProps = {
  account: Account
  onSignOut: () => void
  onDeleted: () => void
}

/** R103: details, password shown on demand, edit, sign out, delete (with confirmation). */
export function CustomerProfile({ account, onSignOut, onDeleted }: CustomerProfileProps) {
  const { updateAccount, deleteAccount } = useAccount()
  const { favorites } = useFavorites()
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  function handleSave(values: Parameters<typeof updateAccount>[0]) {
    const error = updateAccount(values)
    if (error === null) setIsEditing(false)
    return error
  }

  function handleDelete() {
    deleteAccount()
    onDeleted()
  }

  const fullName = `${account.firstName} ${account.lastName}`.trim()

  return (
    <section className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-5 sm:p-8">
      <ProfileHeader
        account={account}
        subtitle={`Membre depuis le ${formatLongDate(account.createdAt)}`}
      />

      {isEditing ? (
        <AccountForm
          initialValues={{
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            password: account.password,
            passwordConfirmation: account.password,
            birthDate: account.birthDate ?? '',
          }}
          submitLabel="Enregistrer"
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ProfileRows
            rows={[
              { label: 'Nom complet', value: fullName },
              { label: 'E-mail', value: account.email },
              {
                label: 'Date de naissance',
                value: account.birthDate ? formatNumericDate(account.birthDate) : '—',
              },
              {
                label: 'Favoris',
                value: (
                  <>
                    {formatCount(favorites.length, 'produit', 'produits')} ·{' '}
                    <Link to="/favoris" className="text-femme underline underline-offset-4">
                      voir
                    </Link>
                  </>
                ),
              },
            ]}
            password={account.password}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={buttonClasses('secondary')}
            >
              Modifier mes informations
            </button>
            <button type="button" onClick={onSignOut} className={buttonClasses('secondary')}>
              Se déconnecter
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className={buttonClasses('danger')}
            >
              Supprimer mon compte
            </button>
          </div>
        </>
      )}

      {isConfirmingDelete && (
        <ConfirmDialog
          title="Supprimer votre compte ?"
          message="Votre compte et votre session seront effacés de ce navigateur. Cette action est définitive."
          confirmLabel="Supprimer mon compte"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </section>
  )
}
