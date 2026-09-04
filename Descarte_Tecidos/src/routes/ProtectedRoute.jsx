import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  const userRole = user.role?.replace('ROLE_', '')
  if (allowedRoles?.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute