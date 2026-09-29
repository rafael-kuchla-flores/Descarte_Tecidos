import api, { getAllPages } from './api'

const getProfile = async () => {
  return await api('/user', { method: 'GET' })
}

const updateProfile = async (userData) => {
  const payload = {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  }

  return await api('/user', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

const changePassword = async (currentPassword, newPassword) => {
  return await api('/user/password', {
    method: 'PATCH',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  })
}

const getUsers = async (params = {}) => getAllPages('/admin/users', params)

const createUser = async (userData) => {
  return await api('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

const deleteUser = async (id) => {
  return await api(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive: false }),
  })
}

const updateUser = async (id, userData) => {
  return await api(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  })
}

const userService = {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
}

export default userService
