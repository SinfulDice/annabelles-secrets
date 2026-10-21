import { describe, expect, it } from 'vitest'
import type { AccountFormValues } from '../types'
import { isAdult, validateAccountForm } from './validateAccountForm'

const today = new Date(2026, 9, 21) // 21 October 2026 (months start at 0)

const valid: AccountFormValues = {
  firstName: 'Camille',
  lastName: 'Dupont',
  email: 'camille@exemple.fr',
  password: 'soleil12',
  passwordConfirmation: 'soleil12',
  birthDate: '1999-04-12',
}

const errorsFor = (overrides: Partial<AccountFormValues>) =>
  validateAccountForm({ ...valid, ...overrides }, today)

describe('R101 sign-up validation', () => {
  it('a complete form has no error (last name is optional)', () => {
    expect(errorsFor({ lastName: '' })).toEqual({})
  })

  it('requires a first name', () => {
    expect(errorsFor({ firstName: ' ' }).firstName).toBe('Saisissez votre prénom.')
  })

  it.each(['', 'camille', 'camille@exemple', 'camille @exemple.fr'])(
    'refuses the e-mail %j',
    (email) => {
      expect(errorsFor({ email }).email).toBeDefined()
    },
  )

  it.each(['soleil1', 'soleilsoleil', '12345'])('refuses the password %j', (password) => {
    expect(errorsFor({ password, passwordConfirmation: password }).password).toBe(
      'Le mot de passe doit faire au moins 8 caractères, dont un chiffre.',
    )
  })

  it('wants the confirmation to match', () => {
    expect(errorsFor({ passwordConfirmation: 'soleil13' }).passwordConfirmation).toBe(
      'Les deux mots de passe ne correspondent pas.',
    )
  })

  it('requires a birth date and an age of 18 or more', () => {
    expect(errorsFor({ birthDate: '' }).birthDate).toBe('Saisissez votre date de naissance.')
    expect(errorsFor({ birthDate: '2010-01-01' }).birthDate).toBe(
      'Vous devez avoir au moins 18 ans pour créer un compte.',
    )
  })
})

describe('R101 being 18', () => {
  it('turns 18 exactly on the birthday', () => {
    expect(isAdult('2008-10-21', today)).toBe(true)
    expect(isAdult('2008-10-22', today)).toBe(false)
  })

  it('refuses a date that is not in ISO form', () => {
    expect(isAdult('21/10/2000', today)).toBe(false)
  })
})
