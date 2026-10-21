import { describe, expect, it } from 'vitest'
import { ADMIN_ACCOUNT } from '../constants/admin'
import type { Account } from '../types'
import {
  checkCredentials,
  getInitials,
  hasCustomerAccount,
  parseAccounts,
  parseSession,
} from './accounts'

const camille: Account = {
  firstName: 'Camille',
  lastName: 'Dupont',
  email: 'camille@exemple.fr',
  password: 'soleil12',
  birthDate: '1999-04-12',
  role: 'customer',
  createdAt: '2026-10-21T09:42:00.000Z',
}

describe('R100 the admin account always exists', () => {
  it('is created on the first launch (nothing stored yet)', () => {
    expect(parseAccounts(null)).toEqual([ADMIN_ACCOUNT])
  })

  it('has the identifiers given in the README', () => {
    expect(ADMIN_ACCOUNT).toMatchObject({
      email: 'admin@annabelles-secrets.fr',
      password: 'P4ssw0rd',
      role: 'admin',
    })
  })

  it('is put back if it was removed from localStorage by hand', () => {
    expect(parseAccounts([camille])).toEqual([ADMIN_ACCOUNT, camille])
  })

  it('keeps the saved accounts and drops invalid items', () => {
    expect(parseAccounts([ADMIN_ACCOUNT, camille, { email: 42 }, 'texte'])).toEqual([
      ADMIN_ACCOUNT,
      camille,
    ])
  })
})

describe('R101 one customer account per browser', () => {
  it('the admin alone does not count as a customer account', () => {
    expect(hasCustomerAccount([ADMIN_ACCOUNT])).toBe(false)
    expect(hasCustomerAccount([ADMIN_ACCOUNT, camille])).toBe(true)
  })
})

describe('R102 sign in', () => {
  const accounts = [ADMIN_ACCOUNT, camille]

  it('finds the account when e-mail and password match (e-mail case does not matter)', () => {
    expect(checkCredentials(accounts, ' Camille@Exemple.fr', 'soleil12')).toBe(camille)
    expect(checkCredentials(accounts, 'admin@annabelles-secrets.fr', 'P4ssw0rd')).toBe(
      ADMIN_ACCOUNT,
    )
  })

  it('refuses a wrong password or an unknown e-mail', () => {
    expect(checkCredentials(accounts, 'camille@exemple.fr', 'Soleil12')).toBeNull()
    expect(checkCredentials(accounts, 'personne@exemple.fr', 'soleil12')).toBeNull()
  })

  it('the session is an e-mail or null', () => {
    expect(parseSession('camille@exemple.fr')).toBe('camille@exemple.fr')
    expect(parseSession(42)).toBeNull()
    expect(parseSession(null)).toBeNull()
  })
})

describe('R103 profile initials', () => {
  it('uses the first letters of first and last name', () => {
    expect(getInitials(camille)).toBe('CD')
    expect(getInitials(ADMIN_ACCOUNT)).toBe('AS')
    expect(getInitials({ firstName: 'léa', lastName: '' })).toBe('L')
  })
})
