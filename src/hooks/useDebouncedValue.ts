import { useEffect, useState } from 'react'

/**
 * Returns `value`, but only once it has stopped changing for `delayMs`.
 * Each new value cancels the previous timer (cleanup), so typing "silicone" quickly
 * gives one update after the last letter instead of eight (R31).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
