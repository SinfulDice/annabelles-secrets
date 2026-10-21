export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger' | 'alarm'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-femme text-white hover:bg-femme-hover',
  secondary: 'border border-line bg-surface text-ink hover:border-ink-muted',
  dark: 'bg-ink text-white hover:bg-ink/85',
  danger: 'border border-danger/40 bg-surface text-danger hover:bg-danger-soft',
  /** Solid red, for the NSFW switch. */
  alarm: 'bg-danger text-white hover:bg-danger/85',
}

/**
 * Kept apart from the components so a <Link> can look like a button:
 * a link that navigates must stay a link (for screen readers and "open in new tab").
 */
export function buttonClasses(variant: ButtonVariant = 'primary'): string {
  return `${base} ${variants[variant]}`
}
