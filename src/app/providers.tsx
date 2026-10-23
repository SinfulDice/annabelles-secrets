import type { ReactNode } from 'react'
import { AccountProvider } from '../contexts/AccountContext'
import { AdsProvider } from '../contexts/AdsContext'
import { AgeGateProvider } from '../contexts/AgeGateContext'
import { CatalogProvider } from '../contexts/CatalogContext'
import { ContentModeProvider } from '../contexts/ContentModeContext'
import { FavoritesProvider } from '../contexts/FavoritesContext'
import { FiltersProvider } from '../contexts/FiltersContext'
import { NewsletterProvider } from '../contexts/NewsletterContext'
import { SessionProductsProvider } from '../contexts/SessionProductsContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ToastProvider } from '../contexts/ToastContext'

/**
 * Order matters: a provider can only use the contexts ABOVE it. FavoritesProvider shows toasts
 * (inside ToastProvider); ContentModeProvider reads the age check (inside AgeGateProvider).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CatalogProvider>
          <SessionProductsProvider>
            <FiltersProvider>
              <FavoritesProvider>
                <AccountProvider>
                  <AgeGateProvider>
                    <ContentModeProvider>
                      <AdsProvider>
                        <NewsletterProvider>{children}</NewsletterProvider>
                      </AdsProvider>
                    </ContentModeProvider>
                  </AgeGateProvider>
                </AccountProvider>
              </FavoritesProvider>
            </FiltersProvider>
          </SessionProductsProvider>
        </CatalogProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
