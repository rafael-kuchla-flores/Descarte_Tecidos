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
    pointPictureUrl: point.pointPictureUrl || null,
    photo: point.pointPictureUrl || point.photo || null,
    description: point.description || '',
    phone: point.phone || '',
    acceptedClothTypes,
    materials: acceptedClothTypes,
    operatingHours,
    hours: operatingHours.length > 0
      ? operatingHours
          .map((item) => `${item.dayOfWeek}: ${item.openingTime} às ${item.closingTime}`)
          .join(' • ')
      : 'Horário comercial',
  }
}

const collectionPointService = {
  getCollectionPoints: async (params = {}) => {
    const response = await api('/collection-points', { method: 'GET', params })
    const content = Array.isArray(response) ? response : response?.content || []
    return content.map(normalizePoint)
  },

  getNearbyPoints: async ({ lat, lng, radiusKm = 15, size = 3 }) => {
    const response = await api('/collection-points/nearby', {
      method: 'GET',
      params: { lat, lng, radiusKm, size },
    })

    const content = Array.isArray(response) ? response : response?.content || []
    return content.map(normalizePoint)
  },

  getPointById: async (id) => {
    const response = await api(`/collection-points/${id}`, { method: 'GET' })
    return response ? normalizePoint(response) : null
  },
}

export default collectionPointService