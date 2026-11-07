import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import UserAvatar from './UserAvatar'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../services/userService', () => ({
  default: {
    getAvatar: vi.fn(),
  },
}))

describe('UserAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({ user: { id: 1, name: 'Alan' } })
  })

  test('uses the initial fallback when the user has no avatar', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    userService.getAvatar.mockRejectedValue(Object.assign(new Error('Not found'), { status: 404 }))

    render(<UserAvatar />)

    expect(await screen.findByText('A')).toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })

  test('logs authentication failures instead of silently hiding them', async () => {
    const error = Object.assign(new Error('Unauthorized'), { status: 401 })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    userService.getAvatar.mockRejectedValue(error)

    render(<UserAvatar />)

    expect(await screen.findByText('A')).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalledWith(
      'Não foi possível carregar o avatar do usuário.',
      error
    )
  })
})
