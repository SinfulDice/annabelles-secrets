import type { Account } from '../types'

/**
 * The admin account that exists from the first launch (R100). Its identifiers are given in
 * the README so the teacher can test creating, editing and deleting products.
 */
export const ADMIN_ACCOUNT: Account = {
  firstName: 'Annabelle',
  lastName: 'Secrets',
  email: 'admin@annabelles-secrets.fr',
  password: 'P4ssw0rd',
  birthDate: null,
  role: 'admin',
  createdAt: '2026-10-21T00:00:00.000Z',
}

export const ADULT_AGE = 18
export const MIN_PASSWORD_LENGTH = 8
