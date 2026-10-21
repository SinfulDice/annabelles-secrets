import { useState } from 'react'
import { useAccount } from '../../contexts/AccountContext'
import { useNewsletter } from '../../contexts/NewsletterContext'
import { Checkbox } from '../ui/Checkbox'
import type { AccountFormValues } from '../../types'
import { tabIds } from '../ui/tabIds'
import { Tabs } from '../ui/Tabs'
import { AccountForm } from './AccountForm'
import { SignInForm } from './SignInForm'

type AuthTab = 'signin' | 'signup'

const TABS: { id: AuthTab; label: string }[] = [
  { id: 'signin', label: 'Se connecter' },
  { id: 'signup', label: 'Créer un compte' },
]

const EMPTY_ACCOUNT: AccountFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  birthDate: '',
}

type AuthPanelProps = {
  onSignedIn: () => void
}

/** Shown when nobody is signed in: two tabs, « Se connecter » and « Créer un compte ». */
export function AuthPanel({ onSignedIn }: AuthPanelProps) {
  const { signUp, hasCustomerAccount } = useAccount()
  const { subscribe } = useNewsletter()
  const [tab, setTab] = useState<AuthTab>('signin')
  const [wantsNewsletter, setWantsNewsletter] = useState(false)
  const ids = tabIds('auth', tab)

  function handleSignUp(values: AccountFormValues) {
    const error = signUp(values)
    if (error !== null) return error
    if (wantsNewsletter) {
      // The account form already checked the age (18+), which the newsletter consent asks for.
      void subscribe({
        firstName: values.firstName,
        email: values.email,
        interests: [],
        frequency: 'monthly',
        consent: true,
      })
    }
    onSignedIn()
    return null
  }

  return (
    <div className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-5 sm:p-8">
      <Tabs
        label="Connexion ou création de compte"
        tabs={TABS}
        selected={tab}
        onSelect={setTab}
        idPrefix="auth"
      />
      <div role="tabpanel" id={ids.panel} aria-labelledby={ids.tab}>
        {tab === 'signin' && <SignInForm onSignedIn={onSignedIn} />}
        {tab === 'signup' && hasCustomerAccount && (
          <p className="text-ink-muted">
            Un compte existe déjà sur ce navigateur (un seul compte par appareil). Connectez-vous
            avec, ou supprimez-le depuis son profil.
          </p>
        )}
        {tab === 'signup' && !hasCustomerAccount && (
          <AccountForm
            initialValues={EMPTY_ACCOUNT}
            submitLabel="Créer mon compte"
            onSubmit={handleSignUp}
            extraField={
              <Checkbox
                id="signup-newsletter"
                label="M'abonner aussi à la newsletter"
                checked={wantsNewsletter}
                onChange={setWantsNewsletter}
              />
            }
          />
        )}
      </div>
    </div>
  )
}
