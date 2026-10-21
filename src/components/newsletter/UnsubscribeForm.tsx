import { useState, type FormEvent } from 'react'
import { useNewsletter } from '../../contexts/NewsletterContext'
import type { Subscriber } from '../../types'
import { isValidEmail } from '../../utils/validateAccountForm'
import { buttonClasses } from '../ui/buttonClasses'
import { Spinner } from '../ui/Spinner'
import { TextField } from '../ui/TextField'

type UnsubscribeState =
  | { status: 'editing' }
  | { status: 'sending' }
  | { status: 'removed'; subscriber: Subscriber }
  | { status: 'notFound'; email: string }
  | { status: 'restored' }

const REASONS = ["Trop d'e-mails", 'Contenu peu intéressant', "Je n'ai jamais demandé ça"]

export function UnsubscribeForm({ initialEmail }: { initialEmail: string }) {
  const { unsubscribe, restore } = useNewsletter()
  const [email, setEmail] = useState(initialEmail)
  // The reason is only asked politely: it is not stored (R141).
  const [reason, setReason] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [state, setState] = useState<UnsubscribeState>({ status: 'editing' })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setEmailError('Format attendu : nom@domaine.fr')
      return
    }
    setEmailError(undefined)
    setState({ status: 'sending' })
    const removed = await unsubscribe(email)
    setState(removed ? { status: 'removed', subscriber: removed } : { status: 'notFound', email })
  }

  if (state.status === 'removed') {
    return (
      <div role="status" className="flex flex-col items-start gap-3">
        <p className="font-bold">C&apos;est fait, vous ne recevrez plus rien.</p>
        <p className="text-ink-muted">Annabelle est triste mais elle comprend.</p>
        <button
          type="button"
          onClick={() => {
            restore(state.subscriber)
            setState({ status: 'restored' })
          }}
          className={buttonClasses('secondary')}
        >
          Annuler et me réabonner
        </button>
      </div>
    )
  }

  const isSending = state.status === 'sending'

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="flex flex-col gap-5"
      aria-busy={isSending}
    >
      {state.status === 'notFound' && (
        <p role="alert" className="rounded-card bg-danger-soft p-4 text-danger">
          <strong>Adresse introuvable.</strong> {state.email} n&apos;est pas inscrit·e à la
          newsletter.
        </p>
      )}
      {state.status === 'restored' && (
        <p role="status" className="rounded-card bg-success-soft p-4 text-success">
          <strong>Réabonnement fait.</strong> Annabelle est ravie de vous garder.
        </p>
      )}
      <fieldset disabled={isSending} className="flex flex-col gap-5">
        <TextField
          id="unsubscribe-email"
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          value={email}
          error={emailError}
          onChange={setEmail}
        />
        <fieldset>
          <legend className="mb-1 text-sm font-semibold">
            Pourquoi partez-vous ? (facultatif)
          </legend>
          {REASONS.map((label) => (
            <label key={label} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="unsubscribe-reason"
                checked={reason === label}
                onChange={() => setReason(label)}
                className="size-5 accent-femme"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <button type="submit" className={`${buttonClasses('danger')} self-start`}>
          {isSending ? (
            <>
              <Spinner />
              Envoi en cours…
            </>
          ) : (
            'Me désabonner'
          )}
        </button>
      </fieldset>
    </form>
  )
}
