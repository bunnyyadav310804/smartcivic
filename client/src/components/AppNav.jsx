import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import { CivicKarmaBadge } from './CivicKarmaBadge.jsx'
import { NotificationBell } from './NotificationBell.jsx'
import { LanguageSelector } from './LanguageSelector.jsx'

export function AppNav() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  function getLinkClass(path) {
    const isActive = location.pathname === path
    return `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
      isActive
        ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`
  }

  return (
    <header className="relative z-50 mb-8 rounded-[2rem] border border-white/10 bg-slate-900/95 px-6 py-4 shadow-glow backdrop-blur-2xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {t('portal_title')}
              </p>
              <p className="text-xs text-slate-400 font-medium">{t('portal_subtitle')}</p>
            </div>
          </Link>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <NotificationBell />
          </div>
        </div>

        {/* Navigation Links — Unified Center Pill Strip */}
        <nav className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur-md shadow-inner">
          <Link className={getLinkClass('/')} to="/">
            {t('home')}
          </Link>
          <Link className={getLinkClass('/complaints')} to="/complaints">
            {t('complaints')}
          </Link>
          <Link className={getLinkClass('/map')} to="/map">
            {t('heat_map')}
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:from-cyan-400 hover:to-teal-400 transition whitespace-nowrap"
            to="/complaints/new"
          >
            <span>+</span> {t('new_issue')}
          </Link>
        </nav>

        {/* Right Section: Language, Karma, Notifications & User Logout */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSelector />

          <CivicKarmaBadge />

          <NotificationBell />

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Citizen'}</p>
              <p className="text-[10px] text-cyan-300 font-mono leading-tight">{user?.email || ''}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 hover:text-rose-200 transition"
              title={t('logout')}
            >
              <span className="text-sm font-bold">⎋</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Profile Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-white/5 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <CivicKarmaBadge />
            <span className="text-slate-400 truncate max-w-[140px]">{user?.name}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-rose-500/20 text-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-500/30"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </header>
  )
}