import { Link } from 'react-router'

/** « La lettre d'Annabelle » block at the bottom of the home page (mockup 01). */
export function NewsletterTeaser() {
  return (
    <section
      aria-labelledby="newsletter-teaser-title"
      className="flex flex-col items-start gap-5 rounded-panel bg-ink p-6 text-on-accent sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border dark:border-line dark:bg-surface dark:text-ink"
    >
      <div>
        <h2 id="newsletter-teaser-title" className="text-3xl font-bold">
          La lettre d&apos;Annabelle
        </h2>
        <p className="mt-2 text-on-accent/80 dark:text-ink-muted">
          Nouveautés, codes promo et conseils, une fois par mois. Désinscription en un clic.
        </p>
      </div>
      <Link
        to="/newsletter"
        className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-page px-6 font-semibold text-ink hover:bg-page/90 dark:bg-femme dark:text-on-accent dark:hover:bg-femme-hover"
      >
        S&apos;inscrire à la newsletter
      </Link>
    </section>
  )
}
