export type Role = 'admin' | 'customer'

/**
 * A demo account, saved as is in localStorage. The password is in plain text ON PURPOSE:
 * it is a fake account system, and the README lists it as a security flaw (R104).
 */
export type Account = {
  firstName: string
  lastName: string
  email: string
  password: string
  /** ISO date "1999-04-12"; null for the admin account. */
  birthDate: string | null
  role: Role
  /** ISO date-time of creation. */
  createdAt: string
}

export type AccountFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
  birthDate: string
}

export type AccountFormErrors = Partial<Record<keyof AccountFormValues, string>>
