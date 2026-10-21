import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Account, AccountFormValues } from '../types'
import {
  checkCredentials,
  findAccount,
  hasCustomerAccount,
  parseAccounts,
  parseSession,
  sameEmail,
} from '../utils/accounts'

type AccountContextValue = {
  currentUser: Account | null
  isAdmin: boolean
  /** True when this browser already has its (single) customer account (R101). */
  hasCustomerAccount: boolean
  /** Returns an error message, or null when the account was created (and signed in). */
  signUp: (values: AccountFormValues) => string | null
  /** Returns false when the e-mail / password pair is wrong (R102). */
  signIn: (email: string, password: string) => boolean
  signOut: () => void
  /** Returns an error message, or null when saved. */
  updateAccount: (values: AccountFormValues) => string | null
  deleteAccount: () => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

const EMAIL_TAKEN = 'Cette adresse e-mail est déjà utilisée.'

function toAccountFields(values: AccountFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    password: values.password,
    birthDate: values.birthDate,
  }
}

/** Fake accounts, entirely in this browser (R100–R104). Nothing is sent to a server. */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.accounts, parseAccounts)
  const [sessionEmail, setSessionEmail] = useLocalStorage(STORAGE_KEYS.session, parseSession)

  const currentUser = sessionEmail ? (findAccount(accounts, sessionEmail) ?? null) : null

  const signUp = useCallback(
    (values: AccountFormValues) => {
      if (hasCustomerAccount(accounts)) return 'Un compte existe déjà sur ce navigateur.'
      if (findAccount(accounts, values.email)) return EMAIL_TAKEN
      const account: Account = {
        ...toAccountFields(values),
        role: 'customer',
        createdAt: new Date().toISOString(),
      }
      setAccounts((previous) => [...previous, account])
      setSessionEmail(account.email)
      return null
    },
    [accounts, setAccounts, setSessionEmail],
  )

  const signIn = useCallback(
    (email: string, password: string) => {
      const account = checkCredentials(accounts, email, password)
      if (!account) return false
      setSessionEmail(account.email)
      return true
    },
    [accounts, setSessionEmail],
  )

  const signOut = useCallback(() => setSessionEmail(null), [setSessionEmail])

  const updateAccount = useCallback(
    (values: AccountFormValues) => {
      if (!currentUser) return 'Vous n’êtes pas connecté.'
      const owner = findAccount(accounts, values.email)
      if (owner && !sameEmail(owner.email, currentUser.email)) return EMAIL_TAKEN
      const fields = toAccountFields(values)
      setAccounts((previous) =>
        previous.map((account) =>
          sameEmail(account.email, currentUser.email) ? { ...account, ...fields } : account,
        ),
      )
      // The session stores the e-mail: it must follow if the e-mail changed.
      setSessionEmail(fields.email)
      return null
    },
    [accounts, currentUser, setAccounts, setSessionEmail],
  )

  // R100: the admin account can't be deleted; for a customer, its data and session go away.
  const deleteAccount = useCallback(() => {
    if (!currentUser || currentUser.role === 'admin') return
    setAccounts((previous) =>
      previous.filter((account) => !sameEmail(account.email, currentUser.email)),
    )
    setSessionEmail(null)
  }, [currentUser, setAccounts, setSessionEmail])

  const value = useMemo<AccountContextValue>(
    () => ({
      currentUser,
      isAdmin: currentUser?.role === 'admin',
      hasCustomerAccount: hasCustomerAccount(accounts),
      signUp,
      signIn,
      signOut,
      updateAccount,
      deleteAccount,
    }),
    [currentUser, accounts, signUp, signIn, signOut, updateAccount, deleteAccount],
  )

  return <AccountContext value={value}>{children}</AccountContext>
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error('useAccount doit être utilisé dans <AccountProvider>.')
  }
  return context
}
