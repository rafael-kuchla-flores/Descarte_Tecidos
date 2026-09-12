import api from './api'

const getPontos = async () => {

  return await api('/collect-points', { method: 'GET' })
}

const createPonto = async (pontoData) => {
  return await api('/collect-points', {
    method: 'POST',
    body: JSON.stringify(pontoData),
  })
}

const toggleStatus = async (id, novoStatus) => {

  return await api(`/collect-points/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: novoStatus }),
  })
}

const pontosService = {
  getPontos,
  createPonto,
  toggleStatus
}

export default pontosService