import type {
  Frequency,
  Interest,
  SubscribeFormErrors,
  SubscribeFormValues,
  Subscriber,
} from '../types'
import { sameEmail } from './accounts'
import { isValidEmail } from './validateAccountForm'

export const INTEREST_LABELS: Record<Interest, string> = {
  femme: 'Femme',
  homme: 'Homme',
  goodies: 'Goodies',
  promo: 'Codes promo',
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: 'hebdomadaire',
  monthly: 'mensuel',
}

function isSubscriber(value: unknown): value is Subscriber {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.email === 'string' &&
    typeof item.firstName === 'string' &&
    Array.isArray(item.interests) &&
    item.interests.every(
      (interest) => typeof interest === 'string' && interest in INTEREST_LABELS,
    ) &&
    (item.frequency === 'weekly' || item.frequency === 'monthly') &&
    typeof item.subscribedAt === 'string'
  )
}

/** What localStorage holds, cleaned like the favorites and accounts (R142). */
export function parseSubscribers(stored: unknown): Subscriber[] {
  return Array.isArray(stored) ? stored.filter(isSubscriber) : []
}

/** R140: e-mail format and the 18+ consent are required; everything else is optional. */
export function validateSubscribeForm(values: SubscribeFormValues): SubscribeFormErrors {
  const errors: SubscribeFormErrors = {}
  if (!isValidEmail(values.email)) errors.email = 'Format attendu : nom@domaine.fr'
  if (!values.consent) {
    errors.consent = 'Cochez cette case pour confirmer votre âge et votre accord.'
  }
  return errors
}

export type SubscribeResult = { subscribers: Subscriber[]; status: 'created' | 'updated' }

/** R140: a new e-mail is added; an e-mail already there gets its preferences updated. */
export function subscribe(
  subscribers: Subscriber[],
  values: SubscribeFormValues,
  now: Date,
): SubscribeResult {
  const fields = {
    email: values.email.trim(),
    firstName: values.firstName.trim(),
    interests: values.interests,
    frequency: values.frequency,
  }
  const existing = subscribers.find((subscriber) => sameEmail(subscriber.email, values.email))
  if (existing) {
    return {
      status: 'updated',
      subscribers: subscribers.map((subscriber) =>
        subscriber === existing ? { ...existing, ...fields } : subscriber,
      ),
    }
  }
  return {
    status: 'created',
    subscribers: [...subscribers, { ...fields, subscribedAt: now.toISOString() }],
  }
}

export type UnsubscribeResult = { subscribers: Subscriber[]; removed: Subscriber | null }

/** R141: removes the e-mail; `removed` is null when it was not subscribed. */
export function unsubscribe(subscribers: Subscriber[], email: string): UnsubscribeResult {
  const removed = subscribers.find((subscriber) => sameEmail(subscriber.email, email)) ?? null
  return {
    removed,
    subscribers: removed ? subscribers.filter((subscriber) => subscriber !== removed) : subscribers,
  }
}

/** « Femme, Goodies, Codes promo · mensuel » */
export function describeSubscription(subscriber: Subscriber): string {
  const interests =
    subscriber.interests.length > 0
      ? subscriber.interests.map((interest) => INTEREST_LABELS[interest]).join(', ')
      : 'Tous les sujets'
  return `${interests} · ${FREQUENCY_LABELS[subscriber.frequency]}`
}
