/** A Promise that resolves after `ms`: lets the fake newsletter "take time" like a server (R142). */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
