import { useEffect, useState } from 'react'

// These lists are saved on this device, not synchronized with the account.
export const POST_FAVORITES_KEY = 'ecotecido:favoritePosts'
export const COLLECTION_POINT_FAVORITES_KEY = 'ecotecido:favoriteCollectionPoints'
const FAVORITES_CHANGED_EVENT = 'ecotecido:favorites-changed'

const readFavorites = (storageKey) => {
  const storedValue = window.localStorage.getItem(storageKey)
  const parsedValue = JSON.parse(storedValue || '[]')

  if (!Array.isArray(parsedValue)) {
    throw new Error('Invalid favorite list')
  }

  return [...new Set(parsedValue.filter((id) => id !== null && id !== '').map(String))]
}

export const useFavorites = (storageKey) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return readFavorites(storageKey)
    } catch {
      return []
    }
  })
  const [favoriteError, setFavoriteError] = useState('')

  useEffect(() => {
    const synchronize = (event) => {
      if (event.type === 'storage' && event.key !== storageKey && event.key !== null) return
      if (event.type === FAVORITES_CHANGED_EVENT && event.detail?.key !== storageKey) return

      try {
        setFavorites(readFavorites(storageKey))
        setFavoriteError('')
      } catch {
        setFavorites([])
        setFavoriteError('Não foi possível ler seus favoritos neste navegador.')
      }
    }

    window.addEventListener('storage', synchronize)
    window.addEventListener(FAVORITES_CHANGED_EVENT, synchronize)

    return () => {
      window.removeEventListener('storage', synchronize)
      window.removeEventListener(FAVORITES_CHANGED_EVENT, synchronize)
    }
  }, [storageKey])

  const isFavorite = (id) => favorites.includes(String(id))

  const toggleFavorite = (id) => {
    if (id === null || id === undefined || String(id) === '') return null

    try {
      const favoriteId = String(id)
      const storedFavorites = readFavorites(storageKey)
      const nextFavorites = storedFavorites.includes(favoriteId)
        ? storedFavorites.filter((savedId) => savedId !== favoriteId)
        : [...storedFavorites, favoriteId]

      window.localStorage.setItem(storageKey, JSON.stringify(nextFavorites))
      setFavorites(nextFavorites)
      setFavoriteError('')
      window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, {
        detail: { key: storageKey },
      }))
      return nextFavorites.includes(favoriteId)
    } catch {
      setFavoriteError('Não foi possível salvar seus favoritos neste navegador.')
      return null
    }
  }

  return { favorites, isFavorite, toggleFavorite, favoriteError }
}
