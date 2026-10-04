const AUTH_TOKEN_KEY = 'smart-civic-auth-token'
const AUTH_USER_KEY = 'smart-civic-auth-user'
const AUTH_REQUEST_TIMEOUT_MS = 20000

function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || '/api'
}

function getHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function requestAuth(path, payload, token) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/${path}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || `Authentication request failed (${response.status})`)
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The server did not respond in time. Check the Vercel function logs and database settings, then try again.')
    }

    if (error instanceof TypeError) {
      throw new Error('Could not reach the API. Check the Vercel deployment and /api route.')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function registerRequest(payload) {
  return requestAuth('register', payload)
}

export async function loginRequest(payload) {
  return requestAuth('login', payload)
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: getHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load current user')
  }

  return data.user
}

export async function fetchAllUsers(token) {
  const response = await fetch(`${getApiBaseUrl()}/auth/users`, {
    headers: getHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load users')
  }

  return data.users || []
}

export function storeAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY)
  return storedUser ? JSON.parse(storedUser) : null
}