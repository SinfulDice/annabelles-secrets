export type Interest = 'femme' | 'homme' | 'goodies' | 'promo'

export type Frequency = 'weekly' | 'monthly'

export type Subscriber = {
  email: string
  firstName: string
  interests: Interest[]
  frequency: Frequency
  /** ISO date-time. */
  subscribedAt: string
}

export type SubscribeFormValues = {
  firstName: string
  email: string
  interests: Interest[]
  frequency: Frequency
  consent: boolean
}

export type SubscribeFormErrors = Partial<Record<'email' | 'consent', string>>
