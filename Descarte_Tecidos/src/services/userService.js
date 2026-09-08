
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
  return await api(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false })
    })
}


const updateUser = async (id, userData) => {
  return await api(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  })
}


export default { getUsers, createUser, deleteUser, updateUser }
