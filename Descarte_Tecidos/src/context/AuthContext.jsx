import { createContext, useEffect, useState } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error)
    return null
  }
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem('token')
  )

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  )

  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    const newToken = data.token

    localStorage.setItem('token', newToken)
    setToken(newToken)

    const tokenData = parseJwt(newToken)
    const role = tokenData?.roles?.[0] || tokenData?.role || tokenData?.authorities?.[0] || null

    const userData = {
      id: tokenData?.id,
      name: tokenData?.name,
      email: tokenData?.sub || email,
      role,
    }

    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    return {
      token: newToken,
      user: userData,
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider