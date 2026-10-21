import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { NEWSLETTER_DELAY_MS, STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { SubscribeFormValues, Subscriber } from '../types'
import { sameEmail } from '../utils/accounts'
import { delay } from '../utils/delay'
import { parseSubscribers, subscribe, unsubscribe } from '../utils/newsletter'

type NewsletterContextValue = {
  isSubscribed: (email: string) => boolean
  findSubscriber: (email: string) => Subscriber | undefined
  /** Waits 600 ms like a server, then subscribes or updates (R140, R142). */
  subscribe: (values: SubscribeFormValues) => Promise<'created' | 'updated'>
  /** Waits 600 ms, then returns the removed subscriber, or null if not found (R141). */
  unsubscribe: (email: string) => Promise<Subscriber | null>
  /** « Annuler et me réabonner »: puts the removed subscriber back, at once. */
  restore: (subscriber: Subscriber) => void
}

const NewsletterContext = createContext<NewsletterContextValue | null>(null)

/** Fake newsletter: subscribers live in this browser only (annabelle:newsletter). */
export function NewsletterProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useLocalStorage(STORAGE_KEYS.newsletter, parseSubscribers)

  const findSubscriber = useCallback(
    (email: string) => subscribers.find((subscriber) => sameEmail(subscriber.email, email)),
    [subscribers],
  )
  const isSubscribed = useCallback(
    (email: string) => findSubscriber(email) !== undefined,
    [findSubscriber],
  )

  const subscribeAfterDelay = useCallback(
    async (values: SubscribeFormValues) => {
      await delay(NEWSLETTER_DELAY_MS)
      // The status is computed on the list at the time of the click; the update itself uses
      // the "previous" form of setState so it never works on an outdated list.
      const { status } = subscribe(subscribers, values, new Date())
      setSubscribers((previous) => subscribe(previous, values, new Date()).subscribers)
      return status
    },
    [subscribers, setSubscribers],
  )

  const unsubscribeAfterDelay = useCallback(
    async (email: string) => {
      await delay(NEWSLETTER_DELAY_MS)
      const { removed } = unsubscribe(subscribers, email)
      setSubscribers((previous) => unsubscribe(previous, email).subscribers)
      return removed
    },
    [subscribers, setSubscribers],
  )

  const restore = useCallback(
    (subscriber: Subscriber) => setSubscribers((previous) => [...previous, subscriber]),
    [setSubscribers],
  )

  const value = useMemo(
    () => ({
      isSubscribed,
      findSubscriber,
      subscribe: subscribeAfterDelay,
      unsubscribe: unsubscribeAfterDelay,
      restore,
    }),
    [isSubscribed, findSubscriber, subscribeAfterDelay, unsubscribeAfterDelay, restore],
  )
  return <NewsletterContext value={value}>{children}</NewsletterContext>
}

export function useNewsletter(): NewsletterContextValue {
  const context = useContext(NewsletterContext)
  if (!context) {
    throw new Error('useNewsletter doit être utilisé dans <NewsletterProvider>.')
  }
  return context
}
