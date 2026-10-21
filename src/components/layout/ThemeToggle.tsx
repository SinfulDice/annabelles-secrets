import { useTheme } from '../../contexts/ThemeContext'
import { MoonIcon, SunIcon } from '../ui/icons'

/** Round moon / sun button of the header: says what a click will do. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activer le thème clair' : 'Activer le thème sombre'}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink hover:border-ink-muted"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
