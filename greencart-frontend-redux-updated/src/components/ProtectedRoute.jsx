import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token)
  const loc = useLocation()
  if (!token) return <Navigate to='/login' state={{ from: loc }} replace />
  return children
}
