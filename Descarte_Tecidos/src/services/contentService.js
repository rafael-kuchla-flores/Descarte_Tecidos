import api, { apiBlob, getAllPages } from './api'

export const listPosts = async (params = {}) => api('/posts', { params })

export const listAllPosts = async (params = {}) => getAllPages('/posts', params)

export const getPost = async (id) => api(`/posts/${id}`)

export const getPostImage = async (id) => apiBlob(`/posts/${id}/image`)

export const listAdminPosts = async (params = {}) => api('/admin/posts', { params })

export const listAllAdminPosts = async (params = {}) => getAllPages('/admin/posts', params)

export const getAdminPost = async (id) => api(`/admin/posts/${id}`)

export const getAdminPostCoverImage = async (id) => apiBlob(`/admin/posts/${id}/cover-image`)

const buildPostFormData = (post, imageFile) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(post)], { type: 'application/json' }))
  if (imageFile) formData.append('image', imageFile)
  return formData
}

export const createPost = async (post, imageFile) => api('/admin/posts', {
  method: 'POST',
  body: buildPostFormData(post, imageFile),
})

export const updatePost = async (id, post, imageFile) => api(`/admin/posts/${id}`, {
  method: 'PATCH',
  body: buildPostFormData(post, imageFile),
})

export const deletePost = async (id, justification) => api(`/admin/posts/${id}`, {
  method: 'DELETE',
  body: JSON.stringify({ justification }),
})

export const listCategories = async () => getAllPages('/categories')

export const listAdminCategories = async () => getAllPages('/admin/categories')

export const getAdminCategory = async (id) => api(`/admin/categories/${id}`)

export const createCategory = async (name) => api('/admin/categories', {
  method: 'POST',
  body: JSON.stringify({ name }),
})

export const updateCategory = async (id, name) => api(`/admin/categories/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ name }),
})

export const deleteCategory = async (id) => api(`/admin/categories/${id}`, {
  method: 'DELETE',
})

export const listClothTypes = async () => getAllPages('/admin/cloth-types')
