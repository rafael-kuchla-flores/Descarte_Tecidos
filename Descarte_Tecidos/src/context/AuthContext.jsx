import { useEffect, useState } from 'react'
import { getCurrentUser, login as loginRequest } from '../services/authService'
import { AuthContext } from './AuthContextDefinition'

const TOKEN_KEY = 'descarte-tecidos-token'
const USER_KEY = 'descarte-tecidos-user'

const readStorage = (key) => {
	try {
		return JSON.parse(localStorage.getItem(key))
	} catch {
		return null
	}
}

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
	const [user, setUser] = useState(() => readStorage(USER_KEY))
	const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(USER_KEY)
		setToken(null)
		setUser(null)
	}

	useEffect(() => {
		if (!token) return

		getCurrentUser(token)
			.then((currentUser) => {
				setUser(currentUser)
				localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
			})
			.catch(() => logout())
			.finally(() => setLoading(false))
	}, [token])

	const login = async (email, password) => {
		const authResponse = await loginRequest(email, password)
		const currentUser = await getCurrentUser(authResponse.token)

		localStorage.setItem(TOKEN_KEY, authResponse.token)
		localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
		setToken(authResponse.token)
		setUser(currentUser)

		return currentUser
	}

	return (
		<AuthContext.Provider value={{ token, user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
