import { RouterProvider } from 'react-router'
import { AppProviders } from './providers'
import { router } from './router'

/** The contexts wrap the router, so filters and favorites survive every page change. */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
