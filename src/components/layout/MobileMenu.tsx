import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAccount } from '../../contexts/AccountContext'
import { buttonClasses } from '../ui/buttonClasses'
import { PlusIcon, UserIcon } from '../ui/icons'
import { MainNav } from './MainNav'

type MobileMenuProps = {
  id: string
  onClose: () => void
}

export function MobileMenu({ id, onClose }: MobileMenuProps) {
  const { currentUser, isAdmin } = useAccount()
  // Escape closes the menu wherever the focus is: listening on document is a side effect
  // outside React, so it goes in an effect, with a cleanup that removes the listener.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div id={id} className="border-t border-line bg-surface px-4 py-4 md:hidden">
      <MainNav direction="column" onNavigate={onClose} />
      <div className="mt-4 flex flex-col gap-2">
        <Link to="/compte" onClick={onClose} className={`${buttonClasses('secondary')} w-full`}>
          <UserIcon />
          {currentUser ? `Mon compte (${currentUser.firstName})` : 'Se connecter'}
        </Link>
        {isAdmin && (
          <Link
            to="/produits/nouveau"
            onClick={onClose}
            className={`${buttonClasses('secondary')} w-full`}
          >
            <PlusIcon />
            Ajouter un produit
          </Link>
        )}
      </div>
    </div>
  )
}
