import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('ProtectedRoute', () => {
  test('redirects unauthenticated user to home', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  test('redirects non-admin user to access denied page', () => {
    useAuth.mockReturnValue({
      user: {
        role: 'DOADOR',
      },
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/acesso-negado"
            element={<div>Access Denied</div>}
          />

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  test('allows admin user to access protected route', () => {
    useAuth.mockReturnValue({
      user: {
        role: 'ADMIN',
      },
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Page')).toBeInTheDocument()
  })
})