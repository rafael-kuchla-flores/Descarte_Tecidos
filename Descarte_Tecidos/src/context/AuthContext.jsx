import { createContext, useEffect, useState } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  )
  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    // 1. Faz o login e pega APENAS o token
    const data = await authService.login(email, password)
    const newToken = data.token

    localStorage.setItem('token', newToken)
    setToken(newToken)

    const tokenData = parseJwt(newToken)
    
    console.log("Dados que vieram escondidos dentro do token:", tokenData)


    const userRole = tokenData?.role || tokenData?.roles || tokenData?.authorities || 'user';
    
    const userData = {
      email: tokenData?.sub || email, 
      role: userRole,
      name: tokenData?.name || 'Administrador'
    }
    
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    return { token: newToken, user: userData }
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