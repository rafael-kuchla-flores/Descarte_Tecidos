import api from './api'

const login = async (email, password) => {
  return await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}


const getMe = async (token) => {
  return await api('/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
const register = async (userData) => {
  return await api('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

const forgotPassword = async (email) => {
  return await api('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  })
}

const resetPassword = async (token, newPassword) => {
  return await api('/auth/forgot-password/reset', {
    method: 'POST',
    body: JSON.stringify({
      token,
      newPassword, 
    }),
  })
}

const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
}

export default authService