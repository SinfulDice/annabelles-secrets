import { Outlet, ScrollRestoration } from 'react-router'
import { useAgeGate } from '../../contexts/AgeGateContext'
import { AdPopup } from '../ads/AdPopup'
import { AgeGate } from './AgeGate'
import { Footer } from './Footer'
import { Header } from './Header'

/** Frame shared by every page: <Outlet /> is where the router puts the current page. */
export function Layout() {
  const { isAgeConfirmed, confirmAge } = useAgeGate()

  return (
    <>
      {/* inert: while the age check is open, the site behind it can't be clicked or focused. */}
      <div inert={!isAgeConfirmed} className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      {!isAgeConfirmed && <AgeGate onConfirm={confirmAge} />}
      <AdPopup />
      {/* Scrolls back to the top on each new page, like a classic website. */}
      <ScrollRestoration />
    </>
  )
}
