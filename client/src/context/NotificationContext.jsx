import { createContext, useContext, useEffect, useState } from 'react'

const NotificationContext = createContext(null)
const NOTIFICATION_STORAGE_KEY = 'smart_civic_notifications'

const initialDemoNotifications = [
  {
    id: 'n1',
    title: 'Ward Assignment Update',
    message: 'Sanitation Ward 4 team has been dispatched to clean the municipal dump.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    type: 'assignment'
  },
  {
    id: 'n2',
    title: 'Issue Resolved with Photos',
    message: 'Road patching completed on 5th Main Pothole repair. Before-and-after proof attached.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: false,
    type: 'resolution'
  },
  {
    id: 'n3',
    title: 'Community Support Alert',
    message: 'Your report on Drainage Blockage received 5 new citizen upvotes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    read: true,
    type: 'upvote'
  }
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialDemoNotifications
    } catch {
      return initialDemoNotifications
    }
  })

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  function addNotification(notification) {
    const next = {
      id: `n_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    setNotifications((prev) => [next, ...prev])
  }

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function clearAll() {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
