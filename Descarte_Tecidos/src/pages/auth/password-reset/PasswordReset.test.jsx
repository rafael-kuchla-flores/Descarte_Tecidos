import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import PasswordReset from './PasswordReset'

vi.mock('../../../components/Header/Header', () => ({
  default: () => <div>Header</div>,
}))

vi.mock('../../../components/footer/Footer', () => ({
  default: () => <div>Footer</div>,
}))

describe('PasswordReset', () => {
  const renderPasswordReset = () => {
    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    )
  }

  test('renders password recovery form', () => {
    renderPasswordReset()

    expect(
      screen.getByRole('heading', { name: 'Recuperar senha' })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('E-mail')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /Enviar link/i,
      })
    ).toBeInTheDocument()
  })

  test('provides navigation back to login', () => {
    renderPasswordReset()

    const loginLink = screen.getByRole('link', {
      name: 'Voltar para o login',
    })

    expect(loginLink).toHaveAttribute('href', '/login')
  })
})