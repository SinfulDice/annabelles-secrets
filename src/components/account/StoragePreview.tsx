import { STORAGE_KEYS } from '../../constants/config'
import type { Account } from '../../types'

/**
 * Shows what the browser really stores for this account, password included: it makes the
 * demo's security flaw visible (R104, mockup 11).
 */
export function StoragePreview({ account }: { account: Account }) {
  return (
    <section aria-labelledby="storage-title" className="rounded-panel bg-ink p-5 text-white">
      <h2 id="storage-title" className="font-mono text-xs text-white/70">
        Ce que contient le navigateur · localStorage › {STORAGE_KEYS.accounts}
      </h2>
      <pre className="mt-3 overflow-x-auto font-mono text-sm leading-relaxed">
        {JSON.stringify(account, null, 2)}
      </pre>
    </section>
  )
}
