import { useState, type FormEvent } from 'react'
import { useNewsletter } from '../../contexts/NewsletterContext'
import type { Frequency, Interest, SubscribeFormValues, Subscriber } from '../../types'
import {
  describeSubscription,
  FREQUENCY_LABELS,
  INTEREST_LABELS,
  validateSubscribeForm,
} from '../../utils/newsletter'
import { buttonClasses } from '../ui/buttonClasses'
import { Checkbox } from '../ui/Checkbox'
import { Spinner } from '../ui/Spinner'
import { TextField } from '../ui/TextField'

type SubscribeState =
  | { status: 'editing' }
  | { status: 'sending' }
  | { status: 'done'; result: 'created' | 'updated'; subscriber: Subscriber }

const INTERESTS = Object.keys(INTEREST_LABELS) as Interest[]
const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Chaque semaine' },
  { value: 'monthly', label: 'Chaque mois' },
]

type SubscribeFormProps = {
  /** Prefilled with the signed-in account's e-mail (R142). */
  initialEmail: string
}

export function SubscribeForm({ initialEmail }: SubscribeFormProps) {
  const { subscribe } = useNewsletter()
  const [values, setValues] = useState<SubscribeFormValues>({
    firstName: '',
    email: initialEmail,
    interests: [],
    frequency: 'monthly',
    consent: false,
  })
  const [hasFailed, setHasFailed] = useState(false)
  const [state, setState] = useState<SubscribeState>({ status: 'editing' })
  const errors = hasFailed ? validateSubscribeForm(values) : {}

  function toggleInterest(interest: Interest, checked: boolean) {
    setValues((previous) => ({
      ...previous,
      interests: checked
        ? [...previous.interests, interest]
        : previous.interests.filter((item) => item !== interest),
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (Object.keys(validateSubscribeForm(values)).length > 0) {
      setHasFailed(true)
      return
    }
    setState({ status: 'sending' })
    const result = await subscribe(values)
    const subscriber: Subscriber = {
      ...values,
      email: values.email.trim(),
      firstName: values.firstName.trim(),
      subscribedAt: new Date().toISOString(),
    }
    setState({ status: 'done', result, subscriber })
  }

  const isSending = state.status === 'sending'

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="flex flex-col gap-5"
      aria-busy={isSending}
    >
      {state.status === 'done' && state.result === 'created' && (
        <p role="status" className="rounded-card bg-success-soft p-4 text-success">
          <strong>
            Bienvenue{state.subscriber.firstName && ` ${state.subscriber.firstName}`} !
          </strong>{' '}
          {state.subscriber.email} est inscrit·e ({describeSubscription(state.subscriber)}).{' '}
          <a href="#se-desabonner" className="underline underline-offset-4">
            Gérer ou se désabonner
          </a>
        </p>
      )}
      {state.status === 'done' && state.result === 'updated' && (
        <p role="status" className="rounded-card bg-homme-soft p-4 text-homme">
          <strong>Déjà inscrit·e.</strong> Cette adresse reçoit déjà la newsletter. Vos préférences
          ont été mises à jour.
        </p>
      )}

      <fieldset disabled={isSending} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="newsletter-firstName"
            label="Prénom"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(firstName) => setValues((previous) => ({ ...previous, firstName }))}
          />
          <TextField
            id="newsletter-email"
            label="Adresse e-mail"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(email) => setValues((previous) => ({ ...previous, email }))}
          />
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold">Ce qui vous intéresse</legend>
          <div className="grid gap-x-4 sm:grid-cols-3">
            {INTERESTS.map((interest) => (
              <Checkbox
                key={interest}
                id={`newsletter-interest-${interest}`}
                label={
                  interest === 'promo'
                    ? INTEREST_LABELS[interest]
                    : `Univers ${INTEREST_LABELS[interest]}`
                }
                checked={values.interests.includes(interest)}
                onChange={(checked) => toggleInterest(interest, checked)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold">Fréquence</legend>
          <div className="flex flex-wrap gap-x-6">
            {FREQUENCIES.map((frequency) => (
              <label key={frequency.value} className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="newsletter-frequency"
                  checked={values.frequency === frequency.value}
                  onChange={() =>
                    setValues((previous) => ({ ...previous, frequency: frequency.value }))
                  }
                  className="size-5 accent-femme"
                />
                {frequency.label}
                <span className="sr-only"> ({FREQUENCY_LABELS[frequency.value]})</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <Checkbox
            id="newsletter-consent"
            label="J'ai 18 ans ou plus et j'accepte de recevoir des e-mails d'Annabelle's Secrets. Désinscription possible à tout moment. *"
            checked={values.consent}
            onChange={(consent) => setValues((previous) => ({ ...previous, consent }))}
          />
          {errors.consent && (
            <p className="text-sm font-semibold text-danger">
              <span aria-hidden="true">! </span>
              {errors.consent}
            </p>
          )}
        </div>

        <button type="submit" className={`${buttonClasses('primary')} self-start`}>
          {isSending ? (
            <>
              <Spinner />
              Envoi en cours…
            </>
          ) : (
            "M'abonner"
          )}
        </button>
      </fieldset>
    </form>
  )
}
