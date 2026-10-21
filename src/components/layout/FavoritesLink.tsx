import { Link } from 'react-router'
import { useFavorites } from '../../contexts/FavoritesContext'
import { HeartIcon } from '../ui/icons'

export function FavoritesLink() {
  const { favorites } = useFavorites()
  const count = favorites.length

  return (
    <Link
      to="/favoris"
      aria-label={`Favoris (${count})`}
      className="relative grid size-11 place-items-center rounded-full border border-line bg-surface text-ink hover:border-ink-muted"
    >
      <HeartIcon />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-femme px-1 text-xs font-bold text-white"
        >
          {count}
        </span>
      )}
    </Link>
  )
}
