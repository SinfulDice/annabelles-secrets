import { useNavigate, useSearchParams } from 'react-router'
import { AdminProfile } from '../components/account/AdminProfile'
import { AuthPanel } from '../components/account/AuthPanel'
import { CustomerProfile } from '../components/account/CustomerProfile'
import { DemoWarning } from '../components/account/DemoWarning'
import { StoragePreview } from '../components/account/StoragePreview'
import { useAccount } from '../contexts/AccountContext'
import { useToast } from '../contexts/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { safeRedirect } from '../utils/redirect'

export function AccountPage() {
  usePageTitle('Mon compte')
  const { currentUser, signOut } = useAccount()
  const { showToast } = useToast()
  const navigate = useNavigate()
  // /compte?retour=/produits/nouveau : where to go back after signing in (R106).
  const [searchParams] = useSearchParams()
  const returnPath = safeRedirect(searchParams.get('retour'))

  function handleSignedIn() {
    showToast('Vous êtes connecté·e')
    // navigate() returns a promise; `void` says we deliberately do not wait for it.
    if (returnPath) void navigate(returnPath)
  }

  function handleSignOut() {
    signOut()
    showToast('Vous êtes déconnecté·e', 'info')
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-4xl font-bold sm:text-5xl">Mon compte</h1>
      </header>
      <DemoWarning />

      {!currentUser && <AuthPanel onSignedIn={handleSignedIn} />}
      {currentUser?.role === 'admin' && (
        <AdminProfile account={currentUser} onSignOut={handleSignOut} />
      )}
      {currentUser?.role === 'customer' && (
        <CustomerProfile
          account={currentUser}
          onSignOut={handleSignOut}
          onDeleted={() => showToast('Votre compte a été supprimé', 'info')}
        />
      )}
      {currentUser && <StoragePreview account={currentUser} />}
    </div>
  )
}
