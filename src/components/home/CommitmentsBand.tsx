import { COMMITMENTS } from '../../constants/home'

export function CommitmentsBand() {
  return (
    <section aria-label="Nos engagements">
      <ul className="grid gap-5 rounded-panel border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        {COMMITMENTS.map((commitment) => (
          <li key={commitment.title} className="flex gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-femme-soft text-femme"
            >
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold">{commitment.title}</p>
              <p className="text-sm text-ink-muted">{commitment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
