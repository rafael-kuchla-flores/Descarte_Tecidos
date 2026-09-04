import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth' 

const ProtectedRoute = ({ adminOnly }) => {
  const { user, loading } = useAuth()

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role ? String(user.role).toLowerCase() : '';
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute