import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { parseThemeChoice, resolveTheme, type Theme } from '../utils/theme'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Shared dark / light theme (R150), saved in localStorage, applied as a class on <html>. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useLocalStorage(STORAGE_KEYS.theme, parseThemeChoice)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia(DARK_QUERY).matches,
  )
  const theme = resolveTheme(choice, systemPrefersDark)

  // Follow the system setting live (only matters while the user has not chosen).
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // <html> is outside React: an effect keeps its class in sync with the theme.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(
    () => setChoice(theme === 'dark' ? 'light' : 'dark'),
    [theme, setChoice],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans <ThemeProvider>.')
  }
  return context
}
