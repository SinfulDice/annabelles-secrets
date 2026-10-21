type SegmentedControlProps<T extends string> = {
  legend: string
  /** Shared by the radios of one group: the browser lets only one of them be checked. */
  name: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  required?: boolean
}

/**
 * Looks like tabs, but is a group of real radio buttons inside a fieldset/legend (R84):
 * arrow keys and screen readers work without extra code.
 * `<T extends string>` (a "generic") keeps the exact type: 'femme' | 'homme'…, not any string.
 */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const { legend, name, value, options, onChange, required = false } = props

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold">
        {legend}
        {required && <RequiredMark />}
      </legend>
      <div
        className="grid gap-1 rounded-field border border-line bg-page p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="grid min-h-9 cursor-pointer place-items-center rounded-[10px] px-0.5 text-xs text-ink-muted has-checked:bg-surface has-checked:font-semibold has-checked:text-ink has-checked:shadow-sm has-focus-visible:outline-3 has-focus-visible:outline-homme sm:text-sm"
          >
            <input
              type="radio"
              name={name}
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

/** The red star of required fields; screen readers hear "obligatoire" instead. */
export function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-1 text-danger">
        *
      </span>
      <span className="sr-only"> (obligatoire)</span>
    </>
  )
}
