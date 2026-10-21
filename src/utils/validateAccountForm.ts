import { ADULT_AGE, MIN_PASSWORD_LENGTH } from '../constants/admin'
import type { AccountFormErrors, AccountFormValues } from '../types'

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HAS_DIGIT = /\d/
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Today as "2026-10-21", in local time (what the user sees on their calendar). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * True when the person is at least 18 on `today`. ISO dates compare like text:
 * born "2008-10-21" → 18th birthday "2026-10-21", adult if today >= that day.
 */
export function isAdult(birthDate: string, today: Date): boolean {
  const match = ISO_DATE.exec(birthDate)
  if (!match) return false
  const [, year, month, day] = match
  const adultBirthday = `${Number(year) + ADULT_AGE}-${month}-${day}`
  return toIsoDate(today) >= adultBirthday
}

export function isValidEmail(email: string): boolean {
  return EMAIL_FORMAT.test(email.trim())
}

/**
 * Sign-up and profile edition checks (R101). `today` is a parameter so the tests can
 * use a fixed date instead of the real clock.
 */
export function validateAccountForm(values: AccountFormValues, today: Date): AccountFormErrors {
  const errors: AccountFormErrors = {}

  if (values.firstName.trim() === '') errors.firstName = 'Saisissez votre prénom.'
  if (!isValidEmail(values.email)) {
    errors.email = 'Saisissez une adresse e-mail valide, par exemple camille@exemple.fr.'
  }
  if (values.password.length < MIN_PASSWORD_LENGTH || !HAS_DIGIT.test(values.password)) {
    errors.password = `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères, dont un chiffre.`
  }
  if (values.passwordConfirmation !== values.password) {
    errors.passwordConfirmation = 'Les deux mots de passe ne correspondent pas.'
  }
  if (values.birthDate === '') {
    errors.birthDate = 'Saisissez votre date de naissance.'
  } else if (!isAdult(values.birthDate, today)) {
    errors.birthDate = `Vous devez avoir au moins ${ADULT_AGE} ans pour créer un compte.`
  }

  return errors
}
