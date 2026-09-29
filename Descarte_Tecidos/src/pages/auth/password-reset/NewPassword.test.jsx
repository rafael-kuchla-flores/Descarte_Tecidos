import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import NewPassword from './NewPassword'

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
  test('renders password reset form', () => {
    render(<NewPassword />)

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

    const consoleMock = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    render(<NewPassword />)

    const passwordInputs =
      screen.getAllByDisplayValue('')

    await user.type(
      passwordInputs[0],
      'abc123'
    )

    await user.type(
      passwordInputs[1],
      'abc123'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(consoleMock).not.toHaveBeenCalled()

    consoleMock.mockRestore()
  })

  test('does not submit when passwords do not match', async () => {
    const user = userEvent.setup()

    const consoleMock = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    render(<NewPassword />)

    const passwordInputs =
      screen.getAllByDisplayValue('')

    await user.type(
      passwordInputs[0],
      'Password123'
    )

    await user.type(
      passwordInputs[1],
      'Different123'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(consoleMock).not.toHaveBeenCalled()

    consoleMock.mockRestore()
  })

  test('accepts valid matching passwords', async () => {
    const user = userEvent.setup()

    const consoleMock = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    render(<NewPassword />)

    const passwordInputs =
      screen.getAllByDisplayValue('')

    await user.type(
      passwordInputs[0],
      'Password123'
    )

    await user.type(
      passwordInputs[1],
      'Password123'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Redefinir senha',
      })
    )

    expect(consoleMock).toHaveBeenCalledWith(
      'Nova senha:',
      'Password123'
    )

    consoleMock.mockRestore()
  })
})