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

    const profile = data.user || await authService.getMe(newToken)
    const tokenData = parseJwt(newToken)
    const roles = profile?.roles || tokenData?.roles || (profile?.role || tokenData?.role ? [profile?.role || tokenData?.role] : [])
    const role = roles[0] || tokenData?.authorities?.[0] || null

    const userData = {
      id: profile?.id ?? tokenData?.id,
      name: profile?.name || tokenData?.name,
      email: profile?.email || tokenData?.sub || email,
      role,
      roles,
      pointId: profile?.pointId ?? tokenData?.pointId ?? null,
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

  const syncUserProfile = (profile, newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      setToken(newToken)
    }

    const roles = profile.roles || user?.roles || []
    const updatedUser = {
      ...user,
      ...profile,
      role: roles[0] || profile.role || user?.role,
      roles,
      avatarRevision: Date.now(),
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
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
        syncUserProfile,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider