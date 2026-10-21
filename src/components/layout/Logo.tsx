import { SITE_NAME } from '../../constants/config'

/** The name with its accent-coloured dot, as on every mockup. */
export function Logo() {
  return (
    <span className="font-display text-xl font-bold tracking-tight text-ink">
      {SITE_NAME}
      <span className="text-femme">.</span>
    </span>
  )
}
