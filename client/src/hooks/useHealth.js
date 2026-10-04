import { useEffect, useState } from 'react'
import { fetchHealth } from '../services/api.js'

export function useHealth() {
  const [status, setStatus] = useState('loading')
  const [payload, setPayload] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHealth() {
      try {
        const data = await fetchHealth()

        if (isMounted) {
          setPayload(data)
          setStatus('ready')
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
          setStatus('error')
        }
      }
    }

    loadHealth()

    return () => {
      isMounted = false
    }
  }, [])

  return { status, payload, error }
}