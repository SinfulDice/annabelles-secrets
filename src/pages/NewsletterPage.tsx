import { SubscribeForm } from '../components/newsletter/SubscribeForm'
import { UnsubscribeForm } from '../components/newsletter/UnsubscribeForm'
import { useAccount } from '../contexts/AccountContext'
import { usePageTitle } from '../hooks/usePageTitle'

const panelClasses = 'flex flex-col gap-5 rounded-panel border border-line bg-surface p-5 sm:p-8'

export function NewsletterPage() {
  usePageTitle('Newsletter')
  const { currentUser } = useAccount()
  // R142: a signed-in person does not have to type their e-mail again.
  const email = currentUser?.email ?? ''

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-4xl font-bold sm:text-5xl">La lettre d&apos;Annabelle</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Nouveautés, codes promo et conseils, sans spam (promis, contrairement à nos pubs). Votre
          adresse reste enregistrée dans ce navigateur uniquement.
        </p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="subscribe-title" className={panelClasses}>
          <h2 id="subscribe-title" className="text-2xl font-bold">
            Recevoir la newsletter
          </h2>
          <SubscribeForm initialEmail={email} />
        </section>
        <section id="se-desabonner" aria-labelledby="unsubscribe-title" className={panelClasses}>
          <h2 id="unsubscribe-title" className="text-2xl font-bold">
            Se désabonner
          </h2>
          <UnsubscribeForm initialEmail={email} />
        </section>
      </div>
    </div>
  )
}
