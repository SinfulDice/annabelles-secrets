import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { AccountFormValues } from '../../types'
import { validateAccountForm } from '../../utils/validateAccountForm'
import { buttonClasses } from '../ui/buttonClasses'
import { TextField } from '../ui/TextField'
import { PasswordToggle } from './PasswordToggle'

type AccountFormProps = {
  initialValues: AccountFormValues
  submitLabel: string
  /** Saves the values; returns an error message to show, or null on success. */
  onSubmit: (values: AccountFormValues) => string | null
  onCancel?: () => void
}

const fieldId = (field: keyof AccountFormValues) => `account-${field}`

/** Sign-up form, also used to edit the profile (R101, R103). */
export function AccountForm({ initialValues, submitLabel, onSubmit, onCancel }: AccountFormProps) {
  const [values, setValues] = useState(initialValues)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const errors = failedAttempts > 0 ? validateAccountForm(values, new Date()) : {}

  // After a failed submit, focus the first wrong field (its message is read with it).
  useEffect(() => {
    if (failedAttempts === 0) return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [failedAttempts])

  function update(field: keyof AccountFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (Object.keys(validateAccountForm(values, new Date())).length > 0) {
      setFailedAttempts((count) => count + 1)
      return
    }
    setSaveError(onSubmit(values))
  }

  const field = (name: keyof AccountFormValues) => ({
    id: fieldId(name),
    value: values[name],
    error: errors[name],
    onChange: (value: string) => update(name, value),
  })
  const passwordType = isPasswordVisible ? 'text' : 'password'

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField {...field('firstName')} label="Prénom" required autoComplete="given-name" />
        <TextField {...field('lastName')} label="Nom" autoComplete="family-name" />
      </div>
      <TextField
        {...field('email')}
        label="Adresse e-mail"
        required
        type="email"
        autoComplete="email"
      />
      <TextField
        {...field('password')}
        label="Mot de passe"
        required
        type={passwordType}
        autoComplete="new-password"
        hint="8 caractères minimum, dont un chiffre."
        trailing={
          <PasswordToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((visible) => !visible)}
            target="les mots de passe"
          />
        }
      />
      <TextField
        {...field('passwordConfirmation')}
        label="Confirmer le mot de passe"
        required
        type={passwordType}
        autoComplete="new-password"
      />
      <TextField {...field('birthDate')} label="Date de naissance" required type="date" />

      {saveError && (
        <p
          role="alert"
          className="rounded-field bg-danger-soft p-3 text-sm font-semibold text-danger"
        >
          {saveError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={`${buttonClasses('primary')} flex-1`}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClasses('secondary')}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
