import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAccount } from '../../contexts/AccountContext'
import { ContentModeToggle } from '../content-mode/ContentModeToggle'
import { buttonClasses } from '../ui/buttonClasses'
import { CloseIcon, MenuIcon, PlusIcon } from '../ui/icons'
import { AccountLink } from './AccountLink'
import { FavoritesLink } from './FavoritesLink'
import { Logo } from './Logo'
import { MainNav } from './MainNav'
import { MobileMenu } from './MobileMenu'

const MOBILE_MENU_ID = 'menu-mobile'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAdmin } = useAccount()
  // useCallback: MobileMenu's effect depends on onClose, so it must not change on every render.
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const isCreatePage = pathname === '/produits/nouveau'

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="grid size-11 place-items-center rounded-full border border-line md:hidden"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <Link to="/" aria-label="Annabelle's Secrets, accueil" onClick={closeMenu}>
            <Logo />
          </Link>
          <div className="hidden md:block">
            <MainNav direction="row" />
          </div>
          <div className="md:hidden">
            <FavoritesLink />
          </div>
        </div>

        <div className="mt-3 hidden items-center gap-2 md:flex">
          {/* R106: only the admin sees the button (the page itself is guarded too). */}
          {isAdmin && (
            <Link
              to="/produits/nouveau"
              aria-current={isCreatePage ? 'page' : undefined}
              className={buttonClasses(isCreatePage ? 'dark' : 'secondary')}
            >
              <PlusIcon />
              Ajouter un produit
            </Link>
          )}
          <FavoritesLink />
          <AccountLink />
          <ContentModeToggle />
        </div>
      </div>

      {isMenuOpen && <MobileMenu id={MOBILE_MENU_ID} onClose={closeMenu} />}
    </header>
  )
}
