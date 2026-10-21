import type { InputHTMLAttributes, ReactNode } from 'react'
import { RequiredMark } from './SegmentedControl'

type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  /** Help shown under the field (e.g. "Entre 0 et 90."). */
  hint?: string
  error?: string
  /** Shows a textarea instead of a one-line input. */
  multiline?: boolean
  /** Right-aligned counter under the field, e.g. "16 / 20". */
  counter?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  type?: 'text' | 'email' | 'password' | 'date'
  /** Lets the browser offer saved values: "email", "current-password", "given-name"… */
  autoComplete?: string
  /** A small button shown inside the field, on the right (e.g. « Afficher »). */
  trailing?: ReactNode
}

const fieldClasses =
  'w-full rounded-field border bg-surface px-4 py-3 aria-invalid:border-2 aria-invalid:border-danger'

/**
 * Label + field + hint + error, wired for screen readers (R72): aria-invalid marks the
 * field as wrong, and aria-describedby makes them read the hint and the error message.
 */
export function TextField(props: TextFieldProps) {
  const { id, label, value, onChange, required = false, hint, error, multiline, counter } = props
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  const sharedProps = {
    id,
    value,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: `${fieldClasses} ${error ? '' : 'border-field'}`,
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <RequiredMark />}
      </label>
      {multiline ? (
        <textarea {...sharedProps} rows={4} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <div className="relative">
          <input
            {...sharedProps}
            className={`${sharedProps.className} ${props.trailing ? 'pr-24' : ''}`}
            type={props.type ?? 'text'}
            inputMode={props.inputMode}
            autoComplete={props.autoComplete}
            onChange={(event) => onChange(event.target.value)}
          />
          {props.trailing && (
            <div className="absolute inset-y-0 right-2 flex items-center">{props.trailing}</div>
          )}
        </div>
      )}
      <div className="flex justify-between gap-4 text-sm">
        <div>
          {error && (
            <p id={errorId} className="font-semibold text-danger">
              <span aria-hidden="true">! </span>
              {error}
            </p>
          )}
          {hint && (
            <p id={hintId} className="text-ink-muted">
              {hint}
            </p>
          )}
        </div>
        {counter && (
          <p aria-hidden="true" className={error ? 'font-semibold text-danger' : 'text-ink-muted'}>
            {counter}
          </p>
        )}
      </div>
    </div>
  )
}
