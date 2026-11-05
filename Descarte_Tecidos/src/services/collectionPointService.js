import api from './api'

const normalizeAddress = (address) => {
  if (!address) return 'Endereço não informado'
  if (typeof address === 'string') return address

  const parts = [
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
  ].filter(Boolean)

  return parts.join(', ')
}

const normalizePoint = (point) => {
  const statusByApiValue = {
    ACTIVE: 'ATIVO',
    PENDING: 'PENDENTE',
    PAUSED: 'PAUSADO',
    SUSPENDED: 'PAUSADO',
  }
  const acceptedClothTypes = point.acceptedClothTypes || point.materials || []
  const operatingHours = point.operatingHours || []
  const distanceKm = point.distanceKm ?? null

  return {
    id: point.id,
    name: point.name || 'Ponto de coleta',
    city: point.address?.city || point.city || 'Localização não informada',
    address: normalizeAddress(point.address),
    latitude: point.latitude ?? point.address?.latitude ?? null,
    longitude: point.longitude ?? point.address?.longitude ?? null,
    distanceKm,
    distance: distanceKm === null ? '' : `${Number(distanceKm).toFixed(1).replace('.', ',')} km`,
    status: statusByApiValue[point.status] || point.status || 'ATIVO',
    pointPictureUrl: point.imageUrl || point.pointPictureUrl || null,
    photo: point.imageUrl || point.pointPictureUrl || point.photo || null,
    description: point.description || '',
    phone: point.phone || '',
    acceptedClothTypes,
    clothTypeIds: point.clothTypeIds || [],
    materials: acceptedClothTypes,
    operatingHours,
    hasPendingUpdate: Boolean(point.hasPendingUpdate),
    hours: operatingHours.length > 0
      ? operatingHours
          .map((item) => `${item.dayOfWeek}: ${item.openTime || item.openingTime} às ${item.closeTime || item.closingTime}`)
          .join(' • ')
      : 'Horário comercial',
  }
}

const collectionPointService = {
  getRawPointById: async (id) => api(`/collection-points/${id}`, { method: 'GET' }),

  getCollectionPoints: async (params = {}) => {
    const response = await api('/collection-points', { method: 'GET', params })
    const content = Array.isArray(response) ? response : response?.content || []
    return content.map(normalizePoint)
  },

  // Retrieves all nearby pages using the API filtering contract.
  getNearbyPoints: async ({ lat, lng, radiusKm = 15, clothTypeIds = [], size = 100 }) => {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
      throw new Error('Valid coordinates are required for nearby search.')
    }

    const results = []
    let page = 0
    let totalPages = 1

    do {
      const response = await api('/collection-points/nearby', {
        method: 'GET',
        params: {
          lat,
          lng,
          radiusKm,
          ...(clothTypeIds.length ? { clothTypeIds: clothTypeIds.join(',') } : {}),
          page,
          size,
        },
      })
      const content = Array.isArray(response) ? response : response?.content || []
      results.push(...content)
      totalPages = Array.isArray(response)
        ? 1
        : response?.page?.totalPages ?? response?.totalPages ?? 1
      page += 1
    } while (page < totalPages)

    return results.map(normalizePoint)
  },

  getPointById: async (id) => {
    const response = await api(`/collection-points/${id}`, { method: 'GET' })
    return response ? normalizePoint(response) : null
  },

  updatePoint: async (id, formData) => {
    const response = await api(`/collection-points/${id}`, {
      method: 'PUT',
      body: formData,
    })
    return response ? normalizePoint(response) : null
  },

  pausePoint: async (id) => api(`/admin/collection-points/${id}/pause`, { method: 'PATCH' }),
}

export default collectionPointService