import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import favoritesService from '../services/favoritesService'

export const POST_FAVORITES_KEY = 'ecotecido:favoritePosts'
export const COLLECTION_POINT_FAVORITES_KEY = 'ecotecido:favoriteCollectionPoints'
const FAVORITES_CHANGED_EVENT = 'ecotecido:favorites-changed'

// A shared request cache avoids one GET per card on the collection-point list.
const remoteRequests = new Map()
const remoteRefreshTimes = new Map()

const readLocalFavorites = (storageKey) => {
  const stored = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
  if (!Array.isArray(stored)) throw new Error('Invalid favorite list')
  return [...new Set(stored.filter((id) => id != null && id !== '').map(String))]
}

const getRemoteFavorites = (cacheKey, storageKey, refresh = false) => {
  // Several cards subscribe to focus; refresh the shared request only once.
  if (refresh && Date.now() - (remoteRefreshTimes.get(cacheKey) || 0) > 1000) {
    remoteRefreshTimes.set(cacheKey, Date.now())
    remoteRequests.delete(cacheKey)
  }
  if (!remoteRequests.has(cacheKey)) {
    const request = favoritesService.listFavoriteIds(storageKey).catch((error) => {
      remoteRequests.delete(cacheKey)
      throw error
    })
    remoteRequests.set(cacheKey, request)
  }
  return remoteRequests.get(cacheKey)
}

const getFavoriteError = (error) => error?.status === 401
  ? 'Não foi possível acessar os favoritos com a autenticação atual. Você pode continuar lendo os conteúdos; a sincronização depende do servidor.'
  : error?.message || 'Não foi possível sincronizar seus favoritos com a conta.'

export const useFavorites = (storageKey) => {
  const { token } = useAuth()
  const usingAccount = Boolean(token)
  // The token is only used as an in-memory cache identifier, never persisted in favorite data.
  const cacheKey = usingAccount ? `${storageKey}:${token}` : null
  const [favorites, setFavorites] = useState(() => {
    if (usingAccount) return []
    try { return readLocalFavorites(storageKey) } catch { return [] }
  })
  const [favoriteError, setFavoriteError] = useState('')
  const [loadingFavorites, setLoadingFavorites] = useState(usingAccount)
  const [favoritesReady, setFavoritesReady] = useState(!usingAccount)
  const [savingFavorite, setSavingFavorite] = useState(false)

  useEffect(() => {
    let active = true

    const synchronize = async (refresh = false) => {
      if (!usingAccount) {
        try {
          const ids = readLocalFavorites(storageKey)
          if (active) {
            setFavorites(ids)
            setFavoriteError('')
            setFavoritesReady(true)
            setLoadingFavorites(false)
          }
        } catch {
          if (active) {
            setFavorites([])
            setFavoriteError('Não foi possível ler seus favoritos neste navegador.')
            setFavoritesReady(false)
            setLoadingFavorites(false)
          }
        }
        return
      }

      if (active) {
        setLoadingFavorites(true)
        setFavoritesReady(false)
        setFavorites([])
      }
      try {
        const ids = await getRemoteFavorites(cacheKey, storageKey, refresh)
        if (active) {
          setFavorites(ids)
          setFavoriteError('')
          setFavoritesReady(true)
        }
      } catch (error) {
        if (active) {
          setFavoriteError(getFavoriteError(error))
          setFavoritesReady(false)
        }
      } finally {
        if (active) setLoadingFavorites(false)
      }
    }

    const synchronizeChanges = (event) => {
      if (event.type === 'storage') {
        if (usingAccount || (event.key !== storageKey && event.key !== null)) return
      } else if (event.detail?.key !== storageKey) return

      // Other components use the cached remote result after a successful PUT/DELETE.
      void synchronize()
    }

    const refreshOnFocus = () => {
      if (usingAccount) void synchronize(true)
    }

    void synchronize()
    window.addEventListener(FAVORITES_CHANGED_EVENT, synchronizeChanges)
    window.addEventListener('storage', synchronizeChanges)
    window.addEventListener('focus', refreshOnFocus)

    return () => {
      active = false
      window.removeEventListener(FAVORITES_CHANGED_EVENT, synchronizeChanges)
      window.removeEventListener('storage', synchronizeChanges)
      window.removeEventListener('focus', refreshOnFocus)
    }
  }, [cacheKey, storageKey, usingAccount])

  const isFavorite = (id) => favorites.includes(String(id))

  const toggleFavorite = async (id) => {
    if (id == null || String(id) === '' || savingFavorite || !favoritesReady) return null
    const favoriteId = String(id)
    const alreadySaved = isFavorite(favoriteId)
    setSavingFavorite(true)
    setFavoriteError('')

    try {
      let nextFavorites
      if (usingAccount) {
        if (alreadySaved) await favoritesService.removeFavorite(storageKey, favoriteId)
        else await favoritesService.addFavorite(storageKey, favoriteId)
        const current = await getRemoteFavorites(cacheKey, storageKey)
        nextFavorites = alreadySaved
          ? current.filter((savedId) => savedId !== favoriteId)
          : [...new Set([...current, favoriteId])]
        remoteRequests.set(cacheKey, Promise.resolve(nextFavorites))
      } else {
        const current = readLocalFavorites(storageKey)
        nextFavorites = alreadySaved
          ? current.filter((savedId) => savedId !== favoriteId)
          : [...new Set([...current, favoriteId])]
        window.localStorage.setItem(storageKey, JSON.stringify(nextFavorites))
      }

      setFavorites(nextFavorites)
      window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: { key: storageKey } }))
      return !alreadySaved
    } catch (error) {
      setFavoriteError(usingAccount ? getFavoriteError(error) : 'Não foi possível salvar seus favoritos neste navegador.')
      return null
    } finally {
      setSavingFavorite(false)
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoriteError,
    loadingFavorites,
    favoritesReady,
    savingFavorite,
    usingAccount,
  }
}
