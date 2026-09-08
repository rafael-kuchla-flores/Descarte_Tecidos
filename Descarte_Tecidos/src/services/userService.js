// src/services/userService.js
import api from './api'

const getUsers = async () => {
  return await api('/admin/users', { method: 'GET' })
}

const createUser = async (userData) => {
  return await api('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

const deleteUser = async (id) => {
  return await api(`/admin/users/${id}`, { method: 'DELETE' })
}

export default { getUsers, createUser, deleteUser }