import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext.jsx'

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-300"
        title="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-bounce">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-cyan-400/40 bg-slate-900 p-4 shadow-2xl z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {unreadCount} new
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-cyan-300 hover:underline"
                >
                  Mark all read
                </button>
              ) : null}
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-300"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-80 space-y-2.5 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No notifications at the moment.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`cursor-pointer rounded-2xl p-3 text-xs transition border ${
                    item.read
                      ? 'border-white/5 bg-white/5 text-slate-400'
                      : 'border-cyan-400/30 bg-cyan-950/40 text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{item.title}</p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300 text-[11px]">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
