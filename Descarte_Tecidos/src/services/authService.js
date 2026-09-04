const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const request = async (path, options = {}) => {
	const response = await fetch(`${API_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		...options,
	})

	if (!response.ok) {
		let errorData = {}

		try {
			errorData = await response.json()
		} catch {
			// Algumas respostas de erro podem não ter corpo JSON.
		}

		const error = new Error(errorData.message || 'Não foi possível concluir a solicitação.')
		error.status = response.status
		error.data = errorData
		throw error
	}

	if (response.status === 204) return null
	return response.json()
}

export const login = (email, password) =>
	request('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	})

export const getCurrentUser = (token) =>
	request('/users/me', {
		headers: { Authorization: `Bearer ${token}` },
	})
