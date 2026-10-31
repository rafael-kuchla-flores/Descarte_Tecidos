import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Profile from './Profile'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../services/userService', () => ({
  default: {
    getProfile: vi.fn(),
    getAvatar: vi.fn(),
    updateProfile: vi.fn(),
    updateAvatar: vi.fn(),
  },
}))

describe('Profile updates', () => {
  const syncUserProfile = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:avatar-preview'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    })
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Usuário', role: 'USER' },
      syncUserProfile,
    })
    userService.getProfile.mockResolvedValue({
      id: 1,
      name: 'Usuário',
      email: 'user@example.com',
      phone: '',
    })
    userService.getAvatar.mockRejectedValue(Object.assign(new Error('Sem avatar'), { status: 404 }))
    userService.updateProfile.mockResolvedValue({
      user: { id: 1, name: 'Usuário atualizado', email: 'user@example.com' },
      token: 'updated-token',
    })
    userService.updateAvatar.mockResolvedValue(null)
  })

  const renderProfile = async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    await screen.findByDisplayValue('Usuário')
  }

  test('saves profile data without uploading an avatar', async () => {
    const user = userEvent.setup()
    await renderProfile()
    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), 'Nome atualizado')
    await user.clear(screen.getByLabelText('E-mail'))
    await user.type(screen.getByLabelText('E-mail'), 'updated@example.com')
    await user.clear(screen.getByLabelText('Telefone'))
    await user.type(screen.getByLabelText('Telefone'), '81999999999')
    await user.click(screen.getByRole('button', { name: 'Salvar perfil' }))

    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith(
        { name: 'Nome atualizado', email: 'updated@example.com', phone: '81999999999' },
        false
      )
    })
    expect(userService.updateAvatar).not.toHaveBeenCalled()
    expect(syncUserProfile).toHaveBeenCalledWith(
      { id: 1, name: 'Usuário atualizado', email: 'user@example.com', phone: '81999999999' },
      'updated-token'
    )
  })

  test('fetches the latest profile when update responses omit the user and preserves a returned token', async () => {
    const user = userEvent.setup()
    const updatedProfile = {
      id: 1,
      name: 'Usuário atualizado',
      email: 'updated@example.com',
      phone: '',
    }
    userService.getProfile
      .mockResolvedValueOnce({
        id: 1,
        name: 'Usuário',
        email: 'user@example.com',
        phone: '',
      })
      .mockResolvedValueOnce(updatedProfile)
    userService.updateAvatar.mockResolvedValue({ token: 'avatar-token' })
    userService.updateProfile.mockResolvedValue(null)
    await renderProfile()
    const image = new File(['image'], 'avatar.png', { type: 'image/png' })

    await user.upload(screen.getByLabelText('Escolher foto'), image)
    await user.click(screen.getByRole('button', { name: 'Salvar perfil' }))

    await waitFor(() => {
      expect(syncUserProfile).toHaveBeenCalledWith(updatedProfile, 'avatar-token')
    })
    expect(userService.getProfile).toHaveBeenCalledTimes(2)
  })

  test('uploads a selected avatar before saving profile fields', async () => {
    const user = userEvent.setup()
    await renderProfile()
    const image = new File(['image'], 'avatar.png', { type: 'image/png' })

    await user.upload(screen.getByLabelText('Escolher foto'), image)
    await user.click(screen.getByRole('button', { name: 'Salvar perfil' }))

    await waitFor(() => expect(userService.updateProfile).toHaveBeenCalled())
    expect(userService.updateAvatar).toHaveBeenCalledWith(image)
    expect(userService.updateAvatar.mock.invocationCallOrder[0])
      .toBeLessThan(userService.updateProfile.mock.invocationCallOrder[0])
    expect(userService.updateProfile).toHaveBeenCalledWith(
      { name: 'Usuário', email: 'user@example.com', phone: '' },
      false
    )
  })

  test('does not upload a selected avatar if it is removed before saving', async () => {
    const user = userEvent.setup()
    await renderProfile()
    const image = new File(['image'], 'avatar.png', { type: 'image/png' })

    await user.upload(screen.getByLabelText('Escolher foto'), image)
    await user.click(screen.getByRole('button', { name: 'Remover foto' }))
    await user.click(screen.getByRole('button', { name: 'Salvar perfil' }))

    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith(
        { name: 'Usuário', email: 'user@example.com', phone: '' },
        true
      )
    })
    expect(userService.updateAvatar).not.toHaveBeenCalled()
  })
})
