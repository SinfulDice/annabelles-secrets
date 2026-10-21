import { useState, type ReactNode } from 'react'
import { PasswordToggle } from './PasswordToggle'

export type ProfileRow = {
  label: string
  value: ReactNode
}

const HIDDEN_PASSWORD = '••••••••'

/** "label: value" list of a profile, with the password hidden until « Afficher » (R103). */
export function ProfileRows({ rows, password }: { rows: ProfileRow[]; password: string }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-line py-3"
        >
          <dt className="text-ink-muted">{row.label}</dt>
          <dd className="text-right font-semibold">{row.value}</dd>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 border-b border-line py-2">
        <dt className="text-ink-muted">Mot de passe</dt>
        <dd className="flex items-center gap-2 font-semibold">
          <span className="font-mono">{isPasswordVisible ? password : HIDDEN_PASSWORD}</span>
          <PasswordToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((visible) => !visible)}
            target="le mot de passe"
          />
        </dd>
      </div>
    </dl>
  )
}
