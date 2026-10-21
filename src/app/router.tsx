import { createBrowserRouter } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { AccountPage } from '../pages/AccountPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductCreatePage } from '../pages/ProductCreatePage'
import { ProductDetailRoute } from '../pages/ProductDetailRoute'
import { ProductsPage } from '../pages/ProductsPage'
import { RequireAdmin } from '../routes/RequireAdmin'

/**
 * One parent route (the Layout, with header and footer) and its child pages.
 * Static paths win over dynamic ones: /produits/nouveau never matches /produits/:id.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'produits', element: <ProductsPage /> },
      {
        path: 'produits/nouveau',
        element: (
          <RequireAdmin>
            <ProductCreatePage />
          </RequireAdmin>
        ),
      },
      { path: 'produits/:id', element: <ProductDetailRoute /> },
      { path: 'favoris', element: <FavoritesPage /> },
      { path: 'compte', element: <AccountPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
