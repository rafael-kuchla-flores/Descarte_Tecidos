
import api, { getAllPages } from './api';

// Formats an address returned as a string or an object.
const normalizeAddress = (address) => {
  if (!address) return 'Endereço não informado';

  if (typeof address === 'string') return address;

  const parts = [
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
  ].filter(Boolean);

  return parts.join(', ');
};

// Normalizes collection point data for React components.
const normalizePoint = (point) => {
  const statusByApiValue = {
    ACTIVE: 'ATIVO',
    PENDING: 'PENDENTE',
    PAUSED: 'PAUSADO',
    SUSPENDED: 'PAUSADO',
  };

  const acceptedClothTypes = Array.isArray(point.acceptedClothTypes)
    ? point.acceptedClothTypes
    : Array.isArray(point.materials)
      ? point.materials
      : [];

  const operatingHours = Array.isArray(point.operatingHours)
    ? point.operatingHours
    : [];

  const distanceKm = point.distanceKm ?? null;

  return {
    id: point.id,
    name: point.name || 'Ponto de coleta',
    city:
      point.address?.city ||
      point.city ||
      'Localização não informada',
    address: normalizeAddress(point.address),
    latitude: point.latitude ?? point.address?.latitude ?? null,
    longitude: point.longitude ?? point.address?.longitude ?? null,
    distanceKm,
    distance:
      distanceKm === null
        ? ''
        : `${Number(distanceKm).toFixed(1).replace('.', ',')} km`,
    status:
      statusByApiValue[point.status] ||
      point.status ||
      'ATIVO',
    pointPictureUrl:
      point.imageUrl ||
      point.pointPictureUrl ||
      null,
    photo:
      point.imageUrl ||
      point.pointPictureUrl ||
      point.photo ||
      null,
    description: point.description || '',
    phone: point.phone || '',
    acceptedClothTypes,
    clothTypeIds: Array.isArray(point.clothTypeIds)
      ? point.clothTypeIds
      : [],
    materials: acceptedClothTypes,
    operatingHours,
    hasPendingUpdate: Boolean(point.hasPendingUpdate),
    hours:
      operatingHours.length > 0
        ? operatingHours
            .map(
              (item) =>
                `${item.dayOfWeek}: ${
                  item.openTime || item.openingTime
                } às ${
                  item.closeTime || item.closingTime
                }`
            )
            .join(' • ')
        : 'Horário comercial',
  };
};

const collectionPointService = {
  // Retrieves a collection point without normalization.
  getRawPointById: async (id) =>
    api(`/collection-points/${id}`, {
      method: 'GET',
    }),

  // Retrieves every page of collection points.
  getCollectionPoints: async (params = {}) => {
    const response = await getAllPages(
      '/collection-points',
      params
    );

    return response.map(normalizePoint);
  },

  // Retrieves nearby points using supported API parameters.
  // Cloth type filtering is handled by the React component.
  getNearbyPoints: async ({
    lat,
    lng,
    radiusKm = 15,
    size = 100,
  }) => {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const radius = Number(radiusKm);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error('Valid coordinates are required for nearby search.');
    }

    if (!Number.isFinite(radius) || radius <= 0) {
      throw new Error('A valid search radius is required.');
    }

    const results = [];
    let page = 0;
    let totalPages = 1;

    do {
      const response = await api('/collection-points/nearby', {
        method: 'GET',
        params: {
          lat: latitude,
          lng: longitude,
          radiusKm: radius,
          page,
          size,
        },
      });

      const content = Array.isArray(response)
        ? response
        : response?.content || [];

      results.push(...content);

      totalPages = Array.isArray(response)
        ? 1
        : response?.page?.totalPages ??
          response?.totalPages ??
          1;

      page += 1;
    } while (page < totalPages);

    return results.map(normalizePoint);
  },

  // Retrieves and normalizes one collection point.
  getPointById: async (id) => {
    const response = await api(
      `/collection-points/${id}`,
      {
        method: 'GET',
      }
    );

    return response ? normalizePoint(response) : null;
  },

  // Updates a collection point.
  updatePoint: async (id, formData) => {
    const response = await api(
      `/collection-points/${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    return response ? normalizePoint(response) : null;
  },

  // Pauses a collection point.
  pausePoint: async (id) =>
    api(`/admin/collection-points/${id}/pause`, {
      method: 'PATCH',
    }),
};

export default collectionPointService;
