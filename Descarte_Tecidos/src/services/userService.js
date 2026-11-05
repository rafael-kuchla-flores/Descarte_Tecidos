import api, { apiBlob, getAllPages } from './api'

const getProfile = async () => {
  return await api('/user', { method: 'GET' })
}

const getAssociations = async () => api('/user/associations', { method: 'GET' })

const getAvatar = async () => apiBlob('/user/avatar', { cache: 'no-store' })

const updateProfile = async (userData, removeAvatar = false) => {
  const formData = new FormData()
  return await api('/user', {
    method: 'PATCH',
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      removeAvatar,
    }),
  })
}

const updateAvatar = async (avatarFile) => {
  const formData = new FormData()
  formData.append('image', avatarFile)

  return await api('/user/avatar', {
    method: 'PUT',
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
  updateAvatar,
  changePassword,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
}

export default userService
