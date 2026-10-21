import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

/**
 * `parse` receives the stored JSON (or null when nothing is stored or it is unreadable)
 * and must return a valid value: localStorage can be edited by hand, so it is never trusted.
 */
function readStoredValue<T>(key: string, parse: (stored: unknown) => T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return parse(raw === null ? null : JSON.parse(raw))
  } catch {
    // Invalid JSON, or storage blocked by the browser.
    return parse(null)
  }
}

/** Like useState, but the value is restored from localStorage and saved on every change. */
export function useLocalStorage<T>(
  key: string,
  parse: (stored: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  // Lazy initial state: localStorage is read only on the first render, not on every render.
  const [value, setValue] = useState(() => readStoredValue(key, parse))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked (private mode): the app keeps working, only without saving.
    }
  }, [key, value])

  return [value, setValue]
}
