
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'
import Register from './Register'
import authService from '../../../services/authService'

const navigateMock = vi.hoisted(() => vi.fn())

vi.mock('../../../services/authService', () => ({
  default: {
    register: vi.fn(),
  },
}))

vi.mock('../../../components/header/Header', () => ({
  default: () => <div>Header</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  const renderRegister = () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
  }

  const fillRegistrationForm = async (
    user,
    password = '123456',
    confirmation = '123456'
  ) => {
    await user.type(
      screen.getByPlaceholderText('Seu nome completo'),
      'Test User'
    )

    await user.type(
      screen.getByPlaceholderText('seu@email.com'),
      'test@example.com'
    )

    await user.type(
      screen.getByPlaceholderText('000.000.000-00'),
      '123.456.789-09'
    )

    await user.type(
      screen.getByPlaceholderText('(11) 99999-9999'),
      '11999999999'
    )

    const passwordInput = document.querySelector(
      'input[type="password"]'
    )

    await user.type(passwordInput, password)

    await user.type(
      screen.getByPlaceholderText('Repita sua senha'),
      confirmation
    )
  }

  test('renders the registration form', () => {
    renderRegister()

    expect(
      screen.getByRole('heading', { name: 'Cadastrar' })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('Seu nome completo')
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('seu@email.com')
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('000.000.000-00')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Criar conta' })
    ).toBeInTheDocument()
  })

  test('shows validation error when required fields are empty', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(
      screen.getByRole('button', { name: 'Criar conta' })
    )

    expect(
      screen.getByText('Por favor, preencha todos os campos.')
    ).toBeInTheDocument()

    expect(authService.register).not.toHaveBeenCalled()
  })

  test('does not register when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillRegistrationForm(user, '123456', '654321')

    await user.click(
      screen.getByRole('button', { name: 'Criar conta' })
    )

    expect(authService.register).not.toHaveBeenCalled()
  })

  test('does not register when password is too short', async () => {
    const user = userEvent.setup()
    renderRegister()

    await fillRegistrationForm(user, '123', '123')

    await user.click(
      screen.getByRole('button', { name: 'Criar conta' })
    )

    expect(authService.register).not.toHaveBeenCalled()
  })

  test('registers a user with normalized CPF and phone', async () => {
    const user = userEvent.setup()

    authService.register.mockResolvedValue({
      message: 'User registered successfully',
    })

    renderRegister()
    await fillRegistrationForm(user)

    await user.click(
      screen.getByRole('button', { name: 'Criar conta' })
    )

    expect(authService.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      phone: '+5511999999999',
      document: '12345678909',
    })

    expect(
      await screen.findByText(
        'Conta criada com sucesso! Redirecionando para o login...'
      )
    ).toBeInTheDocument()
  })

  test('shows API error when registration fails', async () => {
    const user = userEvent.setup()

    const consoleErrorMock = vi.spyOn(console, 'error')
      .mockImplementation(() => {})

    authService.register.mockRejectedValue({
      data: {
        message: 'Email already registered',
      },
    })

    try {
      renderRegister()
      await fillRegistrationForm(user)

      await user.click(
        screen.getByRole('button', { name: 'Criar conta' })
      )

      expect(
        await screen.findByText('Email already registered')
      ).toBeInTheDocument()

      expect(navigateMock).not.toHaveBeenCalled()
    } finally {
      consoleErrorMock.mockRestore()
    }
  })

  test('redirects to login after successful registration', async () => {
    const user = userEvent.setup()

    authService.register.mockResolvedValue({
      message: 'User registered successfully',
    })

    renderRegister()
    await fillRegistrationForm(user)

    await user.click(
      screen.getByRole('button', { name: 'Criar conta' })
    )

    expect(
      await screen.findByText(
        'Conta criada com sucesso! Redirecionando para o login...'
      )
    ).toBeInTheDocument()

    await waitFor(
      () => {
        expect(navigateMock).toHaveBeenCalledWith('/login')
      },
      { timeout: 3500 }
    )
  })
})
