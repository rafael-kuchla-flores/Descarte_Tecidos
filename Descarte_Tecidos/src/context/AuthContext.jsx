import { createContext, useEffect, useState } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
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
    // Faz login
    const data = await authService.login(email, password)

    const newToken = data.token

    // Salva token
    localStorage.setItem('token', newToken)
    setToken(newToken)

    // Lê os dados do JWT
    const tokenData = parseJwt(newToken)

    console.log('Dados do token:', tokenData)

    // Backend envia roles como array
    const role =
      tokenData?.roles?.[0] ||
      tokenData?.role ||
      tokenData?.authorities?.[0] ||
      null

    const userData = {
      id: tokenData?.id,
      name: tokenData?.name,
      email: tokenData?.sub || email,
      role: role,
    }

    console.log('Usuário autenticado:', userData)

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    )

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