import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./api', () => ({
  default: vi.fn(),
  apiBlob: vi.fn(),
  getAllPages: vi.fn(),
}))

import api, { apiBlob, getAllPages } from './api'
import userService from './userService'

beforeEach(() => {
  vi.clearAllMocks()
  api.mockResolvedValue({ ok: true })
  apiBlob.mockResolvedValue(new Blob(['image']))
  getAllPages.mockResolvedValue([])
})

describe('userService', () => {
  it('gets the authenticated user profile', async () => {
    await userService.getProfile()
    expect(api).toHaveBeenCalledWith('/user', { method: 'GET' })
  })
  it('gets user associations', async () => {
    await userService.getAssociations()
    expect(api).toHaveBeenCalledWith('/user/associations', { method: 'GET' })
  })
  it('gets the user avatar', async () => {
    await userService.getAvatar()
    expect(apiBlob).toHaveBeenCalledWith('/user/avatar', { cache: 'no-store' })
  })
  it('updates the user profile', async () => {
    await userService.updateProfile({ name: 'Ana', email: 'ana@example.com', phone: '123' })
    expect(api).toHaveBeenCalledWith('/user', expect.objectContaining({ method: 'PATCH' }))
  })
  it('updates the user avatar', async () => {
    const image = new File(['image'], 'avatar.png', { type: 'image/png' })
    await userService.updateAvatar(image)
    expect(api).toHaveBeenCalledWith('/user/avatar', expect.objectContaining({ method: 'PUT', body: expect.any(FormData) }))
  })
  it('changes the user password', async () => {
    await userService.changePassword('old', 'new')
    expect(api).toHaveBeenCalledWith('/user/password', { method: 'PATCH', body: JSON.stringify({ currentPassword: 'old', newPassword: 'new' }) })
  })
  it('gets all users with pagination parameters', async () => {
    await userService.getUsers({ page: 2 })
    expect(getAllPages).toHaveBeenCalledWith('/admin/users', { page: 2 })
  })
  it('creates a user', async () => {
    await userService.createUser({ name: 'Ana' })
    expect(api).toHaveBeenCalledWith('/admin/users', { method: 'POST', body: JSON.stringify({ name: 'Ana' }) })
  })
  it('deactivates a user', async () => {
    await userService.deleteUser(7)
    expect(api).toHaveBeenCalledWith('/admin/users/7', { method: 'PATCH', body: JSON.stringify({ isActive: false }) })
  })
  it('updates an existing user', async () => {
    await userService.updateUser(7, { name: 'Ana' })
    expect(api).toHaveBeenCalledWith('/admin/users/7', { method: 'PATCH', body: JSON.stringify({ name: 'Ana' }) })
  })
  it('propagates an API error', async () => {
    api.mockRejectedValueOnce(new Error('API unavailable'))
    await expect(userService.getProfile()).rejects.toThrow('API unavailable')
  })
})
