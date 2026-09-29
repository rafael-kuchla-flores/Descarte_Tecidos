import api, { getAllPages } from './api'

const getPontos = async (params = {}) => getAllPages('/admin/collection-points', params)

const getPontosPendentes = async (params = {}) => getAllPages('/admin/collection-points/pending', params)

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

const toggleStatus = async (id, status) => {
  return await api(`/admin/collection-points/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

const pontosService = {
  getPontos,
  getPontosPendentes,
  getClothTypes,
  createClothType,
  updateClothType,
  getPontoById,
  createPonto,
  updatePonto,
  approvePonto,
  rejectPonto,
  toggleStatus,
}

export default pontosService