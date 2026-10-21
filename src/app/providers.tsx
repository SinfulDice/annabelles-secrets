import type { ReactNode } from 'react'
import { AccountProvider } from '../contexts/AccountContext'
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
            <AccountProvider>{children}</AccountProvider>
          </FavoritesProvider>
        </FiltersProvider>
      </ProductsProvider>
    </ToastProvider>
  )
}
