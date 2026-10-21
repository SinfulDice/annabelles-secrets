import { describe, expect, it } from 'vitest'
import type { SubscribeFormValues, Subscriber } from '../types'
import {
  describeSubscription,
  parseSubscribers,
  subscribe,
  unsubscribe,
  validateSubscribeForm,
} from './newsletter'

const now = new Date('2026-10-21T10:00:00.000Z')

const values: SubscribeFormValues = {
  firstName: 'Camille',
  email: 'camille@exemple.fr',
  interests: ['femme', 'goodies', 'promo'],
  frequency: 'monthly',
  consent: true,
}

const camille: Subscriber = {
  email: 'camille@exemple.fr',
  firstName: 'Camille',
  interests: ['femme', 'goodies', 'promo'],
  frequency: 'monthly',
  subscribedAt: now.toISOString(),
}

describe('R140 subscribe form', () => {
  it('a valid form has no error (first name and interests are optional)', () => {
    expect(validateSubscribeForm({ ...values, firstName: '', interests: [] })).toEqual({})
  })

  it('wants a well-formed e-mail', () => {
    expect(validateSubscribeForm({ ...values, email: 'camille@exemple' }).email).toBe(
      'Format attendu : nom@domaine.fr',
    )
  })

  it('requires the 18+ consent', () => {
    expect(validateSubscribeForm({ ...values, consent: false }).consent).toBeDefined()
  })
})

describe('R140 subscribing', () => {
  it('adds a new subscriber with the date', () => {
    expect(subscribe([], values, now)).toEqual({ status: 'created', subscribers: [camille] })
  })

  it('an e-mail already subscribed only gets its preferences updated (no duplicate)', () => {
    const result = subscribe(
      [camille],
      { ...values, email: 'CAMILLE@exemple.fr', frequency: 'weekly' },
      now,
    )
    expect(result.status).toBe('updated')
    expect(result.subscribers).toHaveLength(1)
    expect(result.subscribers[0]?.frequency).toBe('weekly')
  })
})

describe('R141 unsubscribing', () => {
  it('removes the e-mail and returns the removed subscriber (for « me réabonner »)', () => {
    expect(unsubscribe([camille], ' camille@exemple.fr ')).toEqual({
      subscribers: [],
      removed: camille,
    })
  })

  it('« Adresse introuvable » when the e-mail is not subscribed', () => {
    expect(unsubscribe([camille], 'jean@exemple.fr')).toEqual({
      subscribers: [camille],
      removed: null,
    })
  })
})

describe('R142 stored subscribers', () => {
  it('keeps valid subscribers and drops anything else', () => {
    expect(parseSubscribers([camille, { email: 3 }, 'x'])).toEqual([camille])
    expect(parseSubscribers(null)).toEqual([])
  })

  it('describes a subscription for the confirmation message', () => {
    expect(describeSubscription(camille)).toBe('Femme, Goodies, Codes promo · mensuel')
    expect(describeSubscription({ ...camille, interests: [], frequency: 'weekly' })).toBe(
      'Tous les sujets · hebdomadaire',
    )
  })
})
