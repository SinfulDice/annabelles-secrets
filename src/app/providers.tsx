import type { ReactNode } from 'react'
import { AccountProvider } from '../contexts/AccountContext'
import { AdsProvider } from '../contexts/AdsContext'
import { AgeGateProvider } from '../contexts/AgeGateContext'
import { FavoritesProvider } from '../contexts/FavoritesContext'
import { FiltersProvider } from '../contexts/FiltersContext'
import { ProductsProvider } from '../contexts/ProductsContext'
import { ToastProvider } from '../contexts/ToastContext'

/** Order matters: FavoritesProvider shows toasts, so it must be inside ToastProvider. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ProductsProvider>
        <FiltersProvider>
          <FavoritesProvider>
            <AccountProvider>
              <AgeGateProvider>
                <AdsProvider>{children}</AdsProvider>
              </AgeGateProvider>
            </AccountProvider>
          </FavoritesProvider>
        </FiltersProvider>
      </ProductsProvider>
    </ToastProvider>
  )
}
