export type Theme = 'light' | 'dark'

/** What localStorage holds: the user's explicit choice, or null if they never chose. */
export function parseThemeChoice(stored: unknown): Theme | null {
  return stored === 'light' || stored === 'dark' ? stored : null
}

/**
 * R150: the user's choice wins; without a choice, follow the system setting
 * (prefers-color-scheme). Not saving the default means a later change of the system
 * setting is still followed.
 */
export function resolveTheme(choice: Theme | null, systemPrefersDark: boolean): Theme {
  if (choice) return choice
  return systemPrefersDark ? 'dark' : 'light'
}
