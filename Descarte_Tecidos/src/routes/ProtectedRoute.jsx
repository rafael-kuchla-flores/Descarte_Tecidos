import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const normalizeRole = (role) => role?.replace(/^ROLE_/, '').toUpperCase()

const ProtectedRoute = ({ adminOnly = false, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const roles = adminOnly ? ['ADMIN'] : allowedRoles
  const hasPermission = roles.length === 0 || roles.includes(normalizeRole(user.role))

  if (!hasPermission) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />
}

export default ProtectedRoute