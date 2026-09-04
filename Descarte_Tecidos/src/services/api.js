const API_URL = 'http://163.176.41.61:8099/api/v1'

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Só envia o token quando NÃO for uma rota de autenticação
  if (token && !endpoint.startsWith('/auth/')) {
    headers.Authorization = `Bearer ${token}`
  }

  console.log('URL:', `${API_URL}${endpoint}`)
  console.log('Método:', options.method)
  console.log('Headers:', headers)
  console.log('Body:', options.body)

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => null)

  console.log('Status:', response.status)
  console.log('Resposta:', data)

  if (!response.ok) {
    const error = new Error(
      data?.message || 'Ocorreu um erro na requisição.'
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

export default api