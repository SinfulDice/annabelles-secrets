import type { ReactNode } from 'react'
import type { Account } from '../../types'
import { getInitials } from '../../utils/accounts'

type ProfileHeaderProps = {
  account: Account
  subtitle: ReactNode
}

export function ProfileHeader({ account, subtitle }: ProfileHeaderProps) {
  const isAdmin = account.role === 'admin'
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-xl font-bold text-on-accent ${isAdmin ? 'bg-ink' : 'bg-femme'}`}
      >
        {getInitials(account)}
      </span>
      <div>
        <h2 className="text-2xl font-bold">Bonjour {account.firstName}</h2>
        <div className="text-sm text-ink-muted">{subtitle}</div>
      </div>
    </div>
  )
}
