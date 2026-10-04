import { useAuth } from '../context/AuthContext.jsx'
import { AdminLoginPage } from '../pages/AdminLoginPage.jsx'

export function AdminRoute({ children }) {
  const { authReady, user } = useAuth()

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Loading admin portal...
      </div>
    )
  }

  if (user?.role !== 'Admin') {
    return <AdminLoginPage />
  }

  return children
}