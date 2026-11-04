import api from './api'

const getBalance = async () => api('/cashback/balance')

const getHistory = async (params = {}) => api('/cashback/history', { params })

const redeem = async (request) => api('/cashback/redeem', {
  method: 'POST',
  body: JSON.stringify(request),
})

const getMyDisposals = async (params = {}) => api('/disposals/my-disposals', { params })

const createDisposal = async (request) => api('/disposals', {
  method: 'POST',
  body: JSON.stringify(request),
})

const getPublicClothTypes = async () => api('/cloth-types')

const getPendingDisposals = async (collectionPointId, params = {}) => api(
  `/disposals/collection-point/${collectionPointId}/pending`,
  { params },
)

const confirmDisposal = async (id) => api(`/disposals/${id}/confirm`, { method: 'PATCH' })

const rejectDisposal = async (id, justification) => api(`/disposals/${id}/reject`, {
  method: 'PATCH',
  body: JSON.stringify({ justification }),
})

const getCurrentRule = async () => api('/admin/cashback-rules/current')

const updatePointsPerKg = async (pointsPerKg) => api('/admin/cashback-rules/points-per-kg', {
  method: 'PUT',
  body: JSON.stringify({ pointsPerKg }),
})

const cashbackService = {
  getBalance,
  getHistory,
  redeem,
  getMyDisposals,
  createDisposal,
  getPublicClothTypes,
  getPendingDisposals,
  confirmDisposal,
  rejectDisposal,
  getCurrentRule,
  updatePointsPerKg,
}

export default cashbackService
