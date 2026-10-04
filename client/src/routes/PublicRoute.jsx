import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function PublicRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth()

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Loading...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}