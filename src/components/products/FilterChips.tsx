import type { ActiveFilter, FilterKey } from '../../utils/activeFilters'

type FilterChipsProps = {
  activeFilters: ActiveFilter[]
  onRemove: (key: FilterKey) => void
  onReset: () => void
}

/** « Filtres actifs » : each chip removes its criterion; the button clears everything (R32). */
export function FilterChips({ activeFilters, onRemove, onReset }: FilterChipsProps) {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
      <p className="text-sm text-ink-muted">Filtres actifs :</p>
      <ul className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <li key={filter.key}>
            <button
              type="button"
              onClick={() => onRemove(filter.key)}
              aria-label={`Retirer le filtre ${filter.label}`}
              className="flex min-h-11 items-center gap-1.5 rounded-full bg-femme-soft px-3 text-xs font-semibold text-femme hover:bg-femme hover:text-on-accent sm:min-h-9"
            >
              {filter.label}
              <span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onReset}
        className="ml-auto min-h-11 rounded-full border border-line px-4 text-sm font-semibold hover:border-ink-muted sm:min-h-9"
      >
        Réinitialiser les filtres
      </button>
    </div>
  )
}
