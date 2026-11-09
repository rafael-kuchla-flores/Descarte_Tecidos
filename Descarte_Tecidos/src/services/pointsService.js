import api, { apiBlob, getAllPages } from './api'

const getPontos = async (params = {}) => getAllPages('/admin/collection-points', params)

const getPontosPendentes = async (params = {}) => getAllPages('/admin/collection-points/pending', params)

const getPendingUpdates = async (params = {}) => getAllPages('/admin/collection-points/pending-updates', params)

const getClothTypes = async (params = {}) => getAllPages('/admin/cloth-types', params)

const createClothType = async (clothType) => api('/admin/cloth-types', {
  method: 'POST',
  body: JSON.stringify(clothType),
})

const updateClothType = async (id, clothType) => api(`/admin/cloth-types/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(clothType),
})

const getPontoById = async (id) => api(`/admin/collection-points/${id}`, { method: 'GET' })

const getPointImage = async (id) => apiBlob(`/admin/collection-points/${id}/image`)

const getPendingPointImage = async (id) => apiBlob(`/admin/collection-points/${id}/pending-image`)

const createPonto = async (pointData, image) => {
  if (!image) {
    throw new Error('Selecione uma imagem para o ponto de coleta.')
  }

  const body = new FormData()
  body.append('data', new Blob([JSON.stringify(pointData)], { type: 'application/json' }))
  body.append('image', image)

  return await api('/admin/collection-points', {
    method: 'POST',
    body,
  })
}

const updatePonto = async (id, pointData) => {
  return await api(`/admin/collection-points/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(pointData),
  })
}

const approvePonto = async (id) => {
  return await api(`/admin/collection-points/${id}/approve`, { method: 'PATCH' })
}

const rejectPonto = async (id) => {
  return await api(`/admin/collection-points/${id}/reject`, { method: 'PATCH' })
}

const approvePointUpdate = async (id) => api(`/admin/collection-points/${id}/approve-update`, { method: 'POST' })

const rejectPointUpdate = async (id) => api(`/admin/collection-points/${id}/reject-update`, { method: 'POST' })

const getPointUsers = async (id) => api(`/admin/collection-points/${id}/users`)

const addPointOperator = async (id, document) => api(`/admin/collection-points/${id}/users/operators`, {
  method: 'PATCH',
  body: JSON.stringify({ document }),
})

const toggleStatus = async (id, status) => {
  return await api(`/admin/collection-points/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

const pausePoint = async (id) => api(`/admin/collection-points/${id}/pause`, { method: 'PATCH' })

const pontosService = {
  getPontos,
  getPontosPendentes,
  getPendingUpdates,
  getClothTypes,
  createClothType,
  updateClothType,
  getPontoById,
  getPointImage,
  getPendingPointImage,
  createPonto,
  updatePonto,
  approvePonto,
  rejectPonto,
  approvePointUpdate,
  rejectPointUpdate,
  getPointUsers,
  addPointOperator,
  toggleStatus,
  pausePoint,
}

export default pontosService