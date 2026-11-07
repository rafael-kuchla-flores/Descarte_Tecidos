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
      Authorization: `Bearer ${token}`,
    },
  })
}

const register = async (userData) => {
  return await api('/register', {
    method: 'POST',
    body: JSON.stringify({
      name: userData.name,
      document: userData.document,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
    }),
  })
}

const forgotPassword = async (email) => {
  return await api('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
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

const checkResetToken = async (token) => {
  return await api('/auth/forgot-password/check-token', {
    method: 'GET',
    params: { token },
  })
}

const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
  checkResetToken,
}

export default authService