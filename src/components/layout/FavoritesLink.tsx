import { Link, useLocation } from 'react-router'
import { useFavorites } from '../../contexts/FavoritesContext'
import { HeartIcon } from '../ui/icons'

export function FavoritesLink() {
  const { favorites } = useFavorites()
  const count = favorites.length
  const isCurrentPage = useLocation().pathname === '/favoris'

  return (
    <Link
      to="/favoris"
      aria-label={`Favoris (${count})`}
      aria-current={isCurrentPage ? 'page' : undefined}
      className={`relative grid size-11 place-items-center rounded-full border ${isCurrentPage ? 'border-femme bg-femme text-white' : 'border-line bg-surface text-ink hover:border-ink-muted'}`}
    >
      <HeartIcon filled={isCurrentPage} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-xs font-bold text-white ring-2 ring-surface"
        >
          {count}
        </span>
      )}
    </Link>
  )
}
