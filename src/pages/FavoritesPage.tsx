import { useRef } from 'react'
import { Link } from 'react-router'
import { FavoriteRow } from '../components/products/FavoriteRow'
import { buttonClasses } from '../components/ui/buttonClasses'
import { HeartIcon } from '../components/ui/icons'
import { StateMessage } from '../components/ui/StateMessage'
import { SHOP_PATH } from '../constants/navigation'
import { useFavorites } from '../contexts/FavoritesContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSelectCategory } from '../hooks/useSelectCategory'
import { formatCount } from '../utils/formatRating'

export function FavoritesPage() {
  usePageTitle('Favoris')
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const selectCategory = useSelectCategory()
  // The removed row disappears with the button that had the focus: we move the focus to the
  // title so keyboard users are not sent back to the top of the page.
  const titleRef = useRef<HTMLHeadingElement>(null)

  function removeOne(id: number) {
    removeFromFavorites(id)
    titleRef.current?.focus()
  }

  function removeAll() {
    clearFavorites()
    titleRef.current?.focus()
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 ref={titleRef} tabIndex={-1} className="text-4xl font-bold outline-none sm:text-5xl">
            Mes favoris
          </h1>
          <p className="mt-2 text-ink-muted">
            {favorites.length === 0
              ? 'Aucun produit enregistré sur cet appareil'
              : `${formatCount(favorites.length, 'produit', 'produits')} · enregistrés sur cet appareil`}
          </p>
        </div>
        {favorites.length > 0 && (
          <button type="button" onClick={removeAll} className={buttonClasses('secondary')}>
            Tout retirer
          </button>
        )}
      </header>

      {favorites.length === 0 ? (
        <StateMessage
          tone="empty"
          icon={<HeartIcon />}
          title="Vous n'avez encore aucun favori"
          action={
            <Link
              to={SHOP_PATH}
              onClick={() => selectCategory('all')}
              className={buttonClasses('primary')}
            >
              Parcourir la boutique
            </Link>
          }
        >
          <p>
            Touchez le cœur sur un produit pour le retrouver ici, même après avoir fermé le site.
          </p>
        </StateMessage>
      ) : (
        <ul className="flex flex-col gap-4">
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <FavoriteRow favorite={favorite} onRemove={removeOne} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
