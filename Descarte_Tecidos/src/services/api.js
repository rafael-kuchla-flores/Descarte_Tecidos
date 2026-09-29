const API_URL = 'http://163.176.41.61:8080/api/v1'

const buildUrl = (endpoint, params = {}) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)))
      return
    }

    query.append(key, String(value))
  })

  const search = query.toString()
  return search ? `${endpoint}?${search}` : endpoint
}

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  const params = options.params || {}
  const requestUrl = `${API_URL}${buildUrl(endpoint, params)}`

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const shouldUseAuth = !!token && !endpoint.startsWith('/auth/') && !endpoint.startsWith('/register')

  if (shouldUseAuth && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(requestUrl, {
    ...options,
    method: options.method || 'GET',
    headers,
    body: options.body ?? undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)
  if (!response.ok) {
  console.log('STATUS:', response.status)
  console.log('RESPOSTA DO BACKEND:', data)

  const message = data?.message || data?.error || 'Ocorreu um erro na requisição.'

  const error = new Error(message)

  error.status = response.status
  error.data = data
  error.response = response

  throw error
}

  if (!response.ok) {
    const message = data?.message || data?.error || 'Ocorreu um erro na requisição.'
    const error = new Error(message)

    error.status = response.status
    error.data = data
    error.response = response

    throw error
  }

  if (response.status === 204 || data === null || data === '') {
    return null
  }

  return data
}

export const getAllPages = async (endpoint, params = {}) => {
  const size = params.size || 100
  const results = []
  let page = params.page || 0
  let hasNextPage = true

  while (hasNextPage) {
    const response = await api(endpoint, {
      method: 'GET',
      params: { ...params, page, size },
    })
    const content = Array.isArray(response) ? response : response?.content || []
    results.push(...content)
    page += 1
    hasNextPage = response?.page?.totalPages !== undefined
      ? page < response.page.totalPages
      : content.length === size
  }

  return results
}

export default api