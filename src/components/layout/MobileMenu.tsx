import { useEffect } from 'react'
import { Link } from 'react-router'
import { buttonClasses } from '../ui/buttonClasses'
import { PlusIcon } from '../ui/icons'
import { MainNav } from './MainNav'

type MobileMenuProps = {
  id: string
  onClose: () => void
}

export function MobileMenu({ id, onClose }: MobileMenuProps) {
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
      <Link
        to="/produits/nouveau"
        onClick={onClose}
        className={`${buttonClasses('secondary')} mt-4 w-full`}
      >
        <PlusIcon />
        Ajouter un produit
      </Link>
    </div>
  )
}
