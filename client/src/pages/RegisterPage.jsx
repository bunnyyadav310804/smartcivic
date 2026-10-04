import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthField } from '../components/AuthField.jsx'
import { AuthShell } from '../components/AuthShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialState = { name: '', email: '', phone: '', password: '', role: 'Citizen' }

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function validate() {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.email.includes('@')) nextErrors.email = 'Enter a valid email address'
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required'
    if (!formData.password.trim()) nextErrors.password = 'Password is required'
    if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await register({ ...formData, role: 'Citizen' })
      navigate('/', { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Citizen Registration"
      subtitle="Create your citizen account to report civic issues like potholes, garbage, and streetlights with photos and GPS, track resolution timelines, and upvote community reports."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} error={errors.name} />
        <AuthField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <AuthField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
        <AuthField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />

        {submitError ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{submitError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Register as Citizen'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        Already have a citizen account?{' '}
        <Link className="font-semibold text-cyan-300 hover:text-cyan-200" to="/login">
          Login here
        </Link>
      </p>
    </AuthShell>
  )
}