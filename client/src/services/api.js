const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'

export async function fetchHealth() {
  const response = await fetch(`${apiBaseUrl}/health`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export function getApiBaseUrl() {
  return apiBaseUrl
}