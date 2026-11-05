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

  const allowed = adminOnly ? ['ADMIN'] : allowedRoles
  const userRoles = [user.role, ...(Array.isArray(user.roles) ? user.roles : [])]
    .filter(Boolean)
    .map(normalizeRole)
  const hasPermission = allowed.length === 0 || allowed.some((role) => userRoles.includes(normalizeRole(role)))

  if (!hasPermission) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />
}

export default ProtectedRoute