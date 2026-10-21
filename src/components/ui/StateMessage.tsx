import type { ReactNode } from 'react'

type StateMessageProps = {
  tone: 'error' | 'empty'
  title: string
  children: ReactNode
  /** The way out: « Réessayer », « Réinitialiser les filtres », a link… */
  action: ReactNode
}

const iconByTone = {
  error: { symbol: '!', classes: 'bg-danger-soft text-danger' },
  empty: { symbol: '?', classes: 'bg-femme-soft text-femme' },
}

/** The card that replaces a list when it can't be shown: error (R42) or no result (R43). */
export function StateMessage({ tone, title, children, action }: StateMessageProps) {
  const icon = iconByTone[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-panel border border-line bg-surface px-6 py-12 text-center"
    >
      <span
        aria-hidden="true"
        className={`grid size-14 place-items-center rounded-full font-display text-2xl font-bold ${icon.classes}`}
      >
        {icon.symbol}
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="text-ink-muted">{children}</div>
      {action}
    </div>
  )
}
