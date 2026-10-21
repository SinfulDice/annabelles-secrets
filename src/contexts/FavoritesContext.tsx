import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { FavoriteSnapshot, Product } from '../types'
import { addFavorite, parseFavorites, removeFavorite, toFavoriteSnapshot } from '../utils/favorites'
import { useToast } from './ToastContext'

type FavoritesContextValue = {
  favorites: FavoriteSnapshot[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (product: Product) => void
  removeFromFavorites: (id: number) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, parseFavorites)
  const { showToast } = useToast()

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites],
  )

  const removeFromFavorites = useCallback(
    (id: number) => {
      const removed = favorites.find((favorite) => favorite.id === id)
      if (!removed) return
      setFavorites((previous) => removeFavorite(previous, id))
      showToast(`« ${removed.title} » retiré de vos favoris`, 'info')
    },
    [favorites, setFavorites, showToast],
  )

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id)
        return
      }
      setFavorites((previous) => addFavorite(previous, toFavoriteSnapshot(product)))
      showToast(`« ${product.title} » ajouté à vos favoris`)
    },
    [isFavorite, removeFromFavorites, setFavorites, showToast],
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
    showToast('Tous les favoris ont été retirés', 'info')
  }, [setFavorites, showToast])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFromFavorites, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, removeFromFavorites, clearFavorites],
  )

  return <FavoritesContext value={value}>{children}</FavoritesContext>
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites doit être utilisé dans <FavoritesProvider>.')
  }
  return context
}
