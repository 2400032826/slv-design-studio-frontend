import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((s) => s.auth)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-purple-900/30 border-t-purple-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { isAdminAuthenticated, loading } = useSelector((s) => s.auth)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

// Default export for backward compatibility
export default ProtectedRoute
