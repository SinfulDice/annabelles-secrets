import { Link, useLocation } from 'react-router'
import { useAccount } from '../../contexts/AccountContext'
import { getInitials } from '../../utils/accounts'
import { UserIcon } from '../ui/icons'

/** Round account button: an icon when signed out, the initials when signed in (+ ADMIN tag). */
export function AccountLink() {
  const { currentUser, isAdmin } = useAccount()
  const isCurrentPage = useLocation().pathname === '/compte'
  const label = currentUser
    ? `Mon compte : ${currentUser.firstName} ${currentUser.lastName}${isAdmin ? ' (admin)' : ''}`
    : 'Mon compte (non connecté)'

  let colors = 'border-line bg-surface text-ink hover:border-ink-muted'
  if (currentUser)
    colors = isAdmin ? 'border-ink bg-ink text-on-accent' : 'border-femme bg-femme text-on-accent'

  return (
    <Link
      to="/compte"
      aria-label={label}
      aria-current={isCurrentPage ? 'page' : undefined}
      className={`relative grid size-11 place-items-center rounded-full border text-sm font-bold ${colors}`}
    >
      {currentUser ? getInitials(currentUser) : <UserIcon />}
      {isAdmin && (
        <span
          aria-hidden="true"
          className="absolute -bottom-2 rounded-full bg-ad px-1.5 text-[10px] leading-4 font-bold text-ad-ink"
        >
          ADMIN
        </span>
      )}
    </Link>
  )
}
