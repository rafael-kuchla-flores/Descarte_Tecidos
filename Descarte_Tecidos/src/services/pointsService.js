import api, { getAllPages } from './api'

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

const createPonto = async (pointData) => {
  return await api('/admin/collection-points', {
    method: 'POST',
    body: JSON.stringify(pointData),
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

const pontosService = {
  getPontos,
  getPontosPendentes,
  getPendingUpdates,
  getClothTypes,
  createClothType,
  updateClothType,
  getPontoById,
  createPonto,
  updatePonto,
  approvePonto,
  rejectPonto,
  approvePointUpdate,
  rejectPointUpdate,
  getPointUsers,
  addPointOperator,
  toggleStatus,
}

export default pontosService