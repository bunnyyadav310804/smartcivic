import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthField } from '../components/AuthField.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, logout, user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already authenticated as admin, return null or redirect
  if (isAuthenticated && user?.role === 'Admin') {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!formData.email.trim()) nextErrors.email = 'Official email is required'
    if (!formData.password.trim()) nextErrors.password = 'Admin password is required'
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const loggedUser = await login(formData)
      if (loggedUser?.role !== 'Admin') {
        logout()
        setSubmitError('Access Denied: This account does not have Municipal Administrator privileges. Please use citizen login.')
        return
      }
      navigate('/admin', { replace: true })
    } catch (error) {
      setSubmitError(error.message || 'Invalid administrator credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-12">
      <div className="relative isolate w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-cyan-500/20 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300">
          <span>🔒</span> Restricted Municipal Authority Portal
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Municipal Admin Login
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Authorized access only for municipal ward officers, inspectors, and department administrators to manage complaints, upload resolution proof, and track live civic issues.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-3 text-xs text-cyan-200">
            <p className="font-semibold text-cyan-300">🔑 Default Admin Credentials:</p>
            <p className="mt-1 font-mono text-[11px] text-slate-300">
              Email: <span className="text-cyan-300 font-bold">admin@smartcity.gov</span>
            </p>
            <p className="font-mono text-[11px] text-slate-300">
              Password: <span className="text-cyan-300 font-bold">admin123</span>
            </p>
          </div>

          <AuthField
            label="Official Admin Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <AuthField
            label="Admin Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {submitError ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-950/40 p-3.5 text-xs text-rose-200">
              ⚠️ {submitError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:from-cyan-300 hover:to-teal-300 disabled:opacity-60"
          >
            {isSubmitting ? 'Verifying Admin Credentials...' : 'Authenticate & Enter Dashboard'}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="text-slate-300 hover:text-cyan-300 transition">
            ← Return to Citizen Portal
          </Link>
          <Link to="/login" className="text-cyan-300 hover:underline">
            Citizen Login →
          </Link>
        </div>
      </div>
    </main>
  )
}
