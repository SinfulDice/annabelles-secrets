export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

/** Native <select> (keyboard and screen readers work for free) with a visible label (R84). */
export function Select({ id, label, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-field border border-field bg-surface px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
