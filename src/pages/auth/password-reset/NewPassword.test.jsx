import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import NewPassword from './NewPassword'
import authService from '../../../services/authService'

vi.mock('../../../services/authService', () => ({
  default: {
    resetPassword: vi.fn(),
  },
}))

vi.mock('../../../components/Header/Header', () => ({
  default: () => <div>Header</div>,
}))

vi.mock('../../../components/footer/Footer', () => ({
  default: () => <div>Footer</div>,
}))

vi.mock('../../../components/btns/Button', () => ({
  default: ({ children, ...props }) => (
    <button {...props}>
      {children}
    </button>
  ),
}))

describe('NewPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderNewPassword = () => render(
    <MemoryRouter initialEntries={['/redefinir-senha/nova?token=test-token']}>
      <NewPassword />
    </MemoryRouter>
  )

  test('renders password reset form', () => {
    renderNewPassword()

    expect(
      screen.getByRole('heading', {
        name: 'Definir nova senha',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    ).toBeInTheDocument()
  })

  test('does not submit password that does not meet requirements', async () => {
    const user = userEvent.setup()

    renderNewPassword()

    await user.type(screen.getByLabelText('Nova senha'), 'abc123')
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'abc123')

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(screen.getByText('A senha não atende a todos os requisitos.')).toBeInTheDocument()
    expect(authService.resetPassword).not.toHaveBeenCalled()
  })

  test('does not submit when passwords do not match', async () => {
    const user = userEvent.setup()

    renderNewPassword()

    await user.type(screen.getByLabelText('Nova senha'), 'Password123')
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'Different123')

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(screen.getByText('A senha não atende a todos os requisitos.')).toBeInTheDocument()
    expect(authService.resetPassword).not.toHaveBeenCalled()
  })

  test('accepts valid matching passwords', async () => {
    const user = userEvent.setup()

    renderNewPassword()

    await user.type(screen.getByLabelText('Nova senha'), 'Password123')
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'Password123')

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(authService.resetPassword).toHaveBeenCalledWith('test-token', 'Password123')
    expect(screen.getByText('Senha redefinida com sucesso! Redirecionando...')).toBeInTheDocument()
  })
})