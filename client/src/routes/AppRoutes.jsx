import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppNav } from '../components/AppNav.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { NotificationProvider } from '../context/NotificationContext.jsx'
import { KarmaProvider } from '../context/KarmaContext.jsx'
import { LanguageProvider } from '../context/LanguageContext.jsx'
import { CivicAICopilot } from '../components/CivicAICopilot.jsx'
import { ComplaintCreatePage } from '../pages/ComplaintCreatePage.jsx'
import { ComplaintDetailsPage } from '../pages/ComplaintDetailsPage.jsx'
import { ComplaintEditPage } from '../pages/ComplaintEditPage.jsx'
import { ComplaintsPage } from '../pages/ComplaintsPage.jsx'
import { AdminDashboardPage } from '../pages/AdminDashboardPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { MapPage } from '../pages/MapPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { PublicRoute } from './PublicRoute.jsx'
import { AdminRoute } from './AdminRoute.jsx'
import { useState } from 'react'

export function AppRoutes() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <KarmaProvider>
            <BrowserRouter>
              <ComplaintRoutes />
            </BrowserRouter>
          </KarmaProvider>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

function ComplaintRoutes() {
  const [refreshKey, setRefreshKey] = useState(0)

  function refreshComplaints() {
    setRefreshKey((current) => current + 1)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ComplaintsPage refreshKey={refreshKey} />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <MapPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/new"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ComplaintCreatePage onSaved={refreshComplaints} />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ComplaintDetailsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/:id/edit"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ComplaintEditPage onSaved={refreshComplaints} />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ProtectedLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-3 py-5 sm:px-6 lg:px-10 2xl:px-14">
      <div className="mx-auto w-full max-w-[1700px]">
        <AppNav />
        {children}
        <CivicAICopilot />
      </div>
    </div>
  )
}