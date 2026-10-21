import { ADMIN_ACCOUNT } from '../constants/admin'
import type { Account } from '../types'

function isAccount(value: unknown): value is Account {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.firstName === 'string' &&
    typeof item.lastName === 'string' &&
    typeof item.email === 'string' &&
    typeof item.password === 'string' &&
    (typeof item.birthDate === 'string' || item.birthDate === null) &&
    (item.role === 'admin' || item.role === 'customer') &&
    typeof item.createdAt === 'string'
  )
}

/**
 * Reads the saved accounts (R100): invalid items are dropped, and the admin account is
 * always there, even on the very first launch or if someone deleted it by hand.
 */
export function parseAccounts(stored: unknown): Account[] {
  const accounts = Array.isArray(stored) ? stored.filter(isAccount) : []
  const hasAdmin = accounts.some((account) => account.role === 'admin')
  return hasAdmin ? accounts : [ADMIN_ACCOUNT, ...accounts]
}

export function parseSession(stored: unknown): string | null {
  return typeof stored === 'string' ? stored : null
}

/** E-mails are compared without case or surrounding spaces: "Camille@Exemple.fr " = "camille@exemple.fr". */
export function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function findAccount(accounts: Account[], email: string): Account | undefined {
  return accounts.find((account) => sameEmail(account.email, email))
}

/** R102: both the e-mail and the password must match; the caller shows one generic message. */
export function checkCredentials(
  accounts: Account[],
  email: string,
  password: string,
): Account | null {
  const account = findAccount(accounts, email)
  return account && account.password === password ? account : null
}

/** R101: one customer account per browser (the admin does not count). */
export function hasCustomerAccount(accounts: Account[]): boolean {
  return accounts.some((account) => account.role === 'customer')
}

/** "Camille Dupont" → "CD"; "Camille" alone → "C". */
export function getInitials(account: Pick<Account, 'firstName' | 'lastName'>): string {
  return `${account.firstName.trim().charAt(0)}${account.lastName.trim().charAt(0)}`.toUpperCase()
}
