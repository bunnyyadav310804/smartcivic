import { createContext, useContext, useEffect, useState } from 'react'
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  getStoredUser,
  loginRequest,
  registerRequest,
  storeAuthSession
} from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = getStoredToken()
      const storedUser = getStoredUser()

      if (!storedToken) {
        setAuthReady(true)
        return
      }

      setToken(storedToken)

      if (storedUser) {
        setUser(storedUser)
      }

      try {
        const currentUser = await fetchCurrentUser(storedToken)
        setUser(currentUser)
        storeAuthSession(storedToken, currentUser)
      } catch (_error) {
        clearAuthSession()
        setToken('')
        setUser(null)
      } finally {
        setAuthReady(true)
      }
    }

    initializeAuth()
  }, [])

  async function login(credentials) {
    const data = await loginRequest(credentials)
    setToken(data.token)
    setUser(data.user)
    storeAuthSession(data.token, data.user)
    return data.user
  }

  async function register(credentials) {
    const data = await registerRequest(credentials)
    setToken(data.token)
    setUser(data.user)
    storeAuthSession(data.token, data.user)
    return data.user
  }

  function logout() {
    clearAuthSession()
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, authReady, login, register, logout, isAuthenticated: Boolean(token && user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}