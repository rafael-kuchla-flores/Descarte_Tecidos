import api, { apiBlob, getAllPages } from './api'

const getProfile = async () => {
  return await api('/user', { method: 'GET' })
}

const getAssociations = async () => api('/user/associations', { method: 'GET' })

const getAvatar = async () => apiBlob('/user/avatar')

const updateProfile = async (userData, avatarFile, removeAvatar = false) => {
  const payload = {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  }
  if (removeAvatar) payload.removeAvatar = true

  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (avatarFile) formData.append('image', avatarFile)

  return await api('/user', {
    method: 'PATCH',
    body: formData,
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
  getAssociations,
  getAvatar,
  updateProfile,
  changePassword,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
}

export default userService
