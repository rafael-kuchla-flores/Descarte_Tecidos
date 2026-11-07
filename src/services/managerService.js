import api from './api'

const getManagerCollectionPoint = async () => api('/manager/collection-point')

const updateManagerCollectionPoint = async (payload) => api('/manager/collection-point', {
  method: 'PATCH',
  body: JSON.stringify(payload),
})

const updateManagerCollectionPointStatus = async (status) => api('/manager/collection-point/status', {
  method: 'PATCH',
  body: JSON.stringify({ status }),
})

const getManagerDashboard = async () => api('/manager/dashboard')

const getManagerReceipts = async (params = {}) => api('/manager/receipts', { params })

const getOperatorsByPoint = async (pointId) => api(`/collection-points/${pointId}/operators`)
const createOperator = async (pointId, operator) => api(`/collection-points/${pointId}/operators`, {
  method: 'POST',
  body: JSON.stringify(operator),
})
const deleteOperator = async (pointId, operatorId) => api(`/collection-points/${pointId}/operators/${operatorId}`, {
  method: 'DELETE',
})

const managerService = {
  getManagerCollectionPoint,
  getCollectionPoint: getManagerCollectionPoint,
  updateManagerCollectionPoint,
  updateCollectionPoint: updateManagerCollectionPoint,
  updateManagerCollectionPointStatus,
  updateCollectionPointStatus: updateManagerCollectionPointStatus,
  getManagerDashboard,
  getDashboard: getManagerDashboard,
  getManagerReceipts,
  getReceipts: getManagerReceipts,
  getOperatorsByPoint,
  createOperator,
  deleteOperator,
}

export default managerService
