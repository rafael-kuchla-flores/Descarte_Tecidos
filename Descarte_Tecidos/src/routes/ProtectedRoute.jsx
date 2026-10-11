import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />
}

export default ProtectedRoute