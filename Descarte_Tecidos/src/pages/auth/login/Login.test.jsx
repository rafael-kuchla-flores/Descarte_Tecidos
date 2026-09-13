import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Login from './Login'
import { useAuth } from '../../../hooks/useAuth'

const navigateMock = vi.hoisted(() => vi.fn())

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../components/Header/Header', () => ({
  default: () => <div>Header</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Login', () => {
  const loginMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      login: loginMock,
    })
  })

  const renderLogin = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
  }

  test('shows validation error when required fields are empty', async () => {
    const user = userEvent.setup()

    renderLogin()

    await user.click(
      screen.getByRole('button', { name: 'Entrar' })
    )

    expect(
      screen.getByText('Preencha todos os campos.')
    ).toBeInTheDocument()

    expect(loginMock).not.toHaveBeenCalled()
  })

  test('logs in admin user and redirects to admin page', async () => {
    const user = userEvent.setup()

    loginMock.mockResolvedValue({
      user: {
        role: 'ADMIN',
      },
    })

    renderLogin()

    await user.type(
      screen.getByPlaceholderText('seu@email.com'),
      'admin@test.com'
    )

    await user.type(
      screen.getByPlaceholderText('••••••••'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'Entrar' })
    )

    expect(loginMock).toHaveBeenCalledWith(
      'admin@test.com',
      '123456'
    )

    expect(navigateMock).toHaveBeenCalledWith('/admin')
  })

  test('logs in regular user and redirects to home page', async () => {
    const user = userEvent.setup()

    loginMock.mockResolvedValue({
      user: {
        role: 'DOADOR',
      },
    })

    renderLogin()

    await user.type(
      screen.getByPlaceholderText('seu@email.com'),
      'user@test.com'
    )

    await user.type(
      screen.getByPlaceholderText('••••••••'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'Entrar' })
    )

    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  test('shows authentication error when login fails', async () => {
    const user = userEvent.setup()

    loginMock.mockRejectedValue({
      data: {
        message: 'Invalid credentials',
      },
    })

    renderLogin()

    await user.type(
      screen.getByPlaceholderText('seu@email.com'),
      'user@test.com'
    )

    await user.type(
      screen.getByPlaceholderText('••••••••'),
      'wrong-password'
    )

    await user.click(
      screen.getByRole('button', { name: 'Entrar' })
    )

    expect(
      await screen.findByText('Invalid credentials')
    ).toBeInTheDocument()

    expect(navigateMock).not.toHaveBeenCalled()
  })
})