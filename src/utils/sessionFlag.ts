/**
 * sessionStorage is like localStorage, but emptied when the tab is closed: perfect for
 * "once per session" (R123). Blocked storage must not break the page, hence the try/catch.
 */
export function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, 'true')
  } catch {
    // Storage blocked: the pop-up may show again, which is harmless.
  }
}
