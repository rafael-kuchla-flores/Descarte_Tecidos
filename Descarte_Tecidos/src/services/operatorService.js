import api from './api'

const getDashboard = async () => api('/operator/dashboard')
const getReceipts = async (params = {}) => api('/operator/receipts', { params })
const createReceipt = async (receipt) => api('/operator/receipts', {
  method: 'POST',
  body: JSON.stringify(receipt),
})
const getOperators = async (pointId) => api(`/collection-points/${pointId}/operators`)

const operatorService = {
  getDashboard,
  getReceipts,
  createReceipt,
  registerReceipt: createReceipt,
  getOperators,
}

export default operatorService
