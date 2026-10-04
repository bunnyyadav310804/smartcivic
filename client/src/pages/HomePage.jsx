import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchComplaintStats, fetchComplaints } from '../services/complaints.js'
import { ComplaintMapView } from '../components/ComplaintMapView.jsx'
import { IssueAnalyticsCharts } from '../components/IssueAnalyticsCharts.jsx'
import { UpvoteButton } from '../components/UpvoteButton.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import { DEPARTMENT_TEAM_MAP } from '../data/departmentRoster.js'

export function HomePage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [stats, setStats] = useState({ total: 0, submitted: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0 })
  const [complaints, setComplaints] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  const civicCategories = useMemo(() => [
    { name: t('cat_potholes'), icon: '🚧', desc: 'Crater potholes, broken asphalt, damaged pavements', color: 'from-amber-500/20 to-amber-600/10 border-amber-400/30 text-amber-300' },
    { name: t('cat_garbage'), icon: '🗑️', desc: 'Overflowing dustbins, unattended garbage dumps, debris', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30 text-emerald-300' },
    { name: t('cat_drainage'), icon: '🌊', desc: 'Blocked storm drains, open manholes, sewage overflow', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-400/30 text-cyan-300' },
    { name: t('cat_water'), icon: '💧', desc: 'Broken municipal pipes, drinking water wastage, leaks', color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-300' },
    { name: t('cat_streetlights'), icon: '💡', desc: 'Dark streets, flickering lamps, broken light fixtures', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-400/30 text-yellow-300' },
    { name: t('cat_electricity'), icon: '⚡', desc: 'Hanging wires, sparking transformers, power hazards', color: 'from-violet-500/20 to-violet-600/10 border-violet-400/30 text-violet-300' }
  ], [t])

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const [statsData, complaintsData] = await Promise.all([
          fetchComplaintStats().catch(() => ({ total: 0, submitted: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0 })),
          fetchComplaints().catch(() => [])
        ])

        if (mounted) {
          setStats(statsData)
          setComplaints(complaintsData)
          setRecentComplaints(complaintsData)
        }
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-glow backdrop-blur-2xl sm:p-12">
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md">
            <span>🏛️</span> {t('hero_badge')}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
            {t('hero_title_1')} <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">{t('hero_title_2')}</span>
          </h1>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/complaints/new"
              className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 hover:scale-105 active:scale-95"
            >
              <span>+</span> {t('hero_report_btn')}
            </Link>
            <Link
              to="/map"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <span>🗺️</span> {t('hero_map_btn')}
            </Link>
            <Link
              to="/complaints"
              className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t('view_all_complaints')}
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10 pt-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('total_reports')}</p>
            <p className="mt-1 text-3xl font-extrabold text-white">{stats.total}</p>
            <p className="mt-1 text-xs text-cyan-300">{t('live_overview')}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">{t('active_pipeline')}</p>
            <p className="mt-1 text-3xl font-extrabold text-amber-300">{stats.submitted + stats.assigned + stats.inProgress}</p>
            <p className="mt-1 text-xs text-slate-400">{stats.inProgress} {t('stat_in_progress')}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">{t('successfully_resolved')}</p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-300">{stats.resolved}</p>
            <p className="mt-1 text-xs text-emerald-400/80">{t('verified_proof')}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{t('resolution_rate')}</p>
            <p className="mt-1 text-3xl font-extrabold text-cyan-300">{resolutionRate}%</p>
            <p className="mt-1 text-xs text-slate-400">{t('ai_verified')}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300">City analytics</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Complaint trends across the city</h2>
          </div>
        </div>
        <IssueAnalyticsCharts complaints={complaints} />
      </section>

      <section className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-300">Response teams</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Department contacts</h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {Object.entries(DEPARTMENT_TEAM_MAP).slice(0, 6).map(([category, team]) => (
            <div key={category} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-sm font-bold text-cyan-300">{team.department}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{category}</p>
              <div className="mt-3 space-y-2">
                {team.members.map((member) => (
                  <div key={`${category}-${member.name}`} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-xs text-slate-300">
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="mt-1">{member.role}</p>
                    <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="mt-1 inline-block text-cyan-300 hover:underline">
                      {member.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Civic Issue Categories */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{t('category')}</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('browse_categories')}</h2>
          </div>
          <Link to="/complaints/new" className="text-xs font-semibold text-cyan-300 hover:underline">
            {t('new_issue')} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {civicCategories.map((category) => (
            <Link
              key={category.name}
              to={`/complaints/new`}
              className={`group flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 transition-all hover:-translate-y-1 hover:shadow-glow ${category.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{category.icon}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white group-hover:bg-white/20">
                    Report →
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {category.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* City Heat Map Preview */}
      <section className="space-y-4 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              📍 Real-Time GIS Heat Map
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">Live City Issue Map</h2>
            <p className="text-xs text-slate-400">Click any marker to inspect community reports, photos, and live resolution status.</p>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
          >
            Open Fullscreen Map ↗
          </Link>
        </div>

        <div className="pt-2">
          <ComplaintMapView complaints={recentComplaints} height="380px" showHeatmap={true} />
        </div>
      </section>

      {/* How it Works Workflow */}
      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl sm:p-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{t('how_it_works')}</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{t('hero_title_1')}</h2>
          <p className="mt-2 text-xs text-slate-400">{t('live_overview')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 font-bold">
              1
            </div>
            <h4 className="font-bold text-white text-sm">{t('step1_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('step1_desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 font-bold">
              2
            </div>
            <h4 className="font-bold text-white text-sm">{t('step2_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('step2_desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/20 text-indigo-300 font-bold">
              3
            </div>
            <h4 className="font-bold text-white text-sm">{t('step3_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('step3_desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 font-bold">
              4
            </div>
            <h4 className="font-bold text-white text-sm">{t('step4_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('step4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Community Reports Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">{t('recent_reports')}</h2>
            <p className="text-xs text-slate-400">{t('complaints_registry_subtitle')}</p>
          </div>
          <Link to="/complaints" className="text-xs font-semibold text-cyan-300 hover:underline">
            {t('view_all_complaints')}
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400 text-sm">
            {t('no_complaints_found')}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentComplaints.slice(0, 3).map((complaint) => (
              <article key={complaint._id} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/80 p-5 transition hover:border-white/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-400/30">
                      {complaint.category}
                    </span>
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                      {complaint.status}
                    </span>
                  </div>

                  {complaint.images && complaint.images.length > 0 ? (
                    <img src={complaint.images[0]} alt={complaint.title} className="h-36 w-full rounded-2xl object-cover border border-white/10" />
                  ) : null}

                  <h3 className="font-bold text-white line-clamp-1">{complaint.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{complaint.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs text-cyan-300 font-semibold">
                    👍 {complaint.upvotes?.length || complaint.upvoteCount || 0} {t('upvoted')}
                  </span>
                  <Link to={`/complaints/${complaint._id}`} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20">
                    {t('view_details')} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}