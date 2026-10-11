import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { vi } from 'vitest'
import AuthProvider, { AuthContext } from './AuthContext'
import authService from '../services/authService'

vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn(),
  },
}))

const TestConsumer = () => {
  const {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  } = useContext(AuthContext)

  return (
    <div>
      <span data-testid="token">{token || 'no-token'}</span>
      <span data-testid="user">{user?.email || 'no-user'}</span>
      <span data-testid="authenticated">
        {isAuthenticated ? 'yes' : 'no'}
      </span>

      <button
        onClick={() => login('admin@test.com', '123456')}
      >
        Login
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

const createFakeJwt = (payload) => {
  const encodedPayload = btoa(
    JSON.stringify(payload)
  )

  return `header.${encodedPayload}.signature`
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('starts unauthenticated when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
  })

  test('logs in and stores authentication data', async () => {
    const token = createFakeJwt({
      id: 1,
      name: 'Admin User',
      sub: 'admin@test.com',
      roles: ['ADMIN'],
    })

    authService.login.mockResolvedValue({
      token,
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    expect(authService.login).toHaveBeenCalledWith(
      'admin@test.com',
      '123456'
    )

    expect(localStorage.getItem('token')).toBe(token)

    expect(
      JSON.parse(localStorage.getItem('user'))
    ).toEqual({
      id: 1,
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'ADMIN',
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
  })

  test('logs out and removes authentication data', async () => {
    localStorage.setItem('token', 'stored-token')
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'admin@test.com',
        role: 'ADMIN',
      })
    )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
  })
})