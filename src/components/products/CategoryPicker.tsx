import { CATEGORY_LABELS } from '../../constants/config'
import type { CategoryFilter } from '../../types'

const OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'femme', label: CATEGORY_LABELS.femme },
  { value: 'homme', label: CATEGORY_LABELS.homme },
  { value: 'goodies', label: CATEGORY_LABELS.goodies },
]

type CategoryPickerProps = {
  value: CategoryFilter
  onChange: (category: CategoryFilter) => void
}

/**
 * Looks like a segmented control, but is a group of real radio buttons inside a
 * fieldset/legend (R84): arrow keys and screen readers work without extra code.
 */
export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold">Catégorie</legend>
      <div className="grid grid-cols-4 gap-1 rounded-field border border-line bg-page p-1">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="grid min-h-9 cursor-pointer place-items-center rounded-[10px] px-0.5 text-xs text-ink-muted has-checked:bg-surface has-checked:font-semibold has-checked:text-ink has-checked:shadow-sm has-focus-visible:outline-3 has-focus-visible:outline-homme sm:text-sm"
          >
            <input
              type="radio"
              name="category"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
