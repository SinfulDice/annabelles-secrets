import { useState, type FormEvent } from 'react'
import { useAccount } from '../../contexts/AccountContext'
import { buttonClasses } from '../ui/buttonClasses'
import { TextField } from '../ui/TextField'
import { PasswordToggle } from './PasswordToggle'

type SignInFormProps = {
  onSignedIn: () => void
}

export function SignInForm({ onSignedIn }: SignInFormProps) {
  const { signIn } = useAccount()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (signIn(email, password)) {
      onSignedIn()
      return
    }
    setHasFailed(true)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* R102: one generic message, which doesn't say whether the e-mail exists. */}
      {hasFailed && (
        <p role="alert" className="rounded-field bg-danger-soft p-3 text-sm text-danger">
          <strong>E-mail ou mot de passe incorrect.</strong> Vérifiez vos informations.
        </p>
      )}
      <TextField
        id="signin-email"
        label="Adresse e-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <TextField
        id="signin-password"
        label="Mot de passe"
        type={isPasswordVisible ? 'text' : 'password'}
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        trailing={
          <PasswordToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((visible) => !visible)}
            target="le mot de passe"
          />
        }
      />
      <button type="submit" className={buttonClasses('primary')}>
        Se connecter
      </button>
    </form>
  )
}
