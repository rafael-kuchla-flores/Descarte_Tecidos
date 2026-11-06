import api, { getAllPages } from './api'

const FAVORITE_ENDPOINTS = {
  'ecotecido:favoritePosts': '/user/favorite-posts',
  'ecotecido:favoriteCollectionPoints': '/user/favorite-collection-points',
}

const getEndpoint = (storageKey) => {
  const endpoint = FAVORITE_ENDPOINTS[storageKey]
  if (!endpoint) throw new Error('Unsupported favorite type.')
  return endpoint
}

const listFavoriteIds = async (storageKey) => {
  const items = await getAllPages(getEndpoint(storageKey), { size: 100 })
  return [...new Set(items.map((item) => item?.id).filter((id) => id != null).map(String))]
}

const addFavorite = (storageKey, id) => api(`${getEndpoint(storageKey)}/${encodeURIComponent(id)}`, {
  method: 'PUT',
})

const removeFavorite = (storageKey, id) => api(`${getEndpoint(storageKey)}/${encodeURIComponent(id)}`, {
  method: 'DELETE',
})

export default { listFavoriteIds, addFavorite, removeFavorite }
