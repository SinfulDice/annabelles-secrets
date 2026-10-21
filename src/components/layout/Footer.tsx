import { Link } from 'react-router'
import { SITE_NAME } from '../../constants/config'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-muted sm:flex-row sm:justify-between">
        <p>{SITE_NAME} · Site réservé aux personnes majeures (18+).</p>
        <p>
          Projet étudiant React · données fictives via DummyJSON ·{' '}
          <Link to="/newsletter" className="text-femme underline underline-offset-4">
            Newsletter
          </Link>
        </p>
      </div>
    </footer>
  )
}
