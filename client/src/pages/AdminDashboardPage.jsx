import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardCard } from '../components/DashboardCard.jsx'
import { fetchComplaintStats, fetchFilteredComplaints, updateComplaintStatus } from '../services/complaints.js'
import { fetchAllUsers } from '../services/auth.js'
import { UpvoteButton } from '../components/UpvoteButton.jsx'
import { IssueAnalyticsCharts } from '../components/IssueAnalyticsCharts.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { NotificationBell } from '../components/NotificationBell.jsx'
import { WardAnalyticsModal } from '../components/WardAnalyticsModal.jsx'
import { getDepartmentTeam } from '../data/departmentRoster.js'

const statusOptions = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected']
const categoryOptions = [
  'All',
  'Potholes / Road Damage',
  'Garbage & Sanitation',
  'Drainage Blockage',
  'Water Leakage',
  'Damaged Streetlights',
  'Electricity & Hazards',
  'Roads',
  'Sanitation',
  'Water',
  'Electricity',
  'Other'
]

const departmentOptions = [
  'All',
  'Roads & Transport Department',
  'Sanitation Department',
  'Storm Water Management',
  'Water Supply Department',
  'Electrical Maintenance Division',
  'Power & Safety Unit',
  'City Operations Cell'
]

export function AdminDashboardPage() {
  const { user, token, logout } = useAuth()
  const [statistics, setStatistics] = useState({ total: 0, submitted: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0 })
  const [complaints, setComplaints] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [savingId, setSavingId] = useState('')
  const [remarksById, setRemarksById] = useState({})
  const [statusById, setStatusById] = useState({})
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

  const filters = useMemo(() => ({
    search,
    status: statusFilter,
    category: categoryFilter,
    department: departmentFilter
  }), [search, statusFilter, categoryFilter, departmentFilter])

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [stats, list, allUsers] = await Promise.all([
          fetchComplaintStats(),
          fetchFilteredComplaints(filters),
          token ? fetchAllUsers(token) : []
        ])

        if (mounted) {
          setStatistics(stats)
          setComplaints(list)
          setUsers(allUsers)
          setRemarksById(Object.fromEntries(list.map((complaint) => [complaint._id, complaint.remarks || ''])))
          setStatusById(Object.fromEntries(list.map((complaint) => [complaint._id, complaint.status || 'Submitted'])))
        }
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (mounted) {
          setLoading(false)
          setUsersLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [filters.search, filters.status, filters.category, filters.department, token])

  async function handleStatusSave(id) {
    setSavingId(id)
    try {
      await updateComplaintStatus(id, { status: statusById[id], remarks: remarksById[id] })
      const [stats, list] = await Promise.all([
        fetchComplaintStats(),
        fetchFilteredComplaints(filters)
      ])
      setStatistics(stats)
      setComplaints(list)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setSavingId('')
    }
  }

  function handleUpvoteUpdate(updatedComplaint) {
    setComplaints((current) =>
      current.map((c) => (c._id === updatedComplaint._id ? { ...c, ...updatedComplaint } : c))
    )
  }

  function handleExportCsv() {
    if (!complaints.length) return

    const headers = ['Title', 'Category', 'Department', 'Status', 'Address', 'Created At', 'Upvotes', 'Rating']
    const rows = complaints.map((complaint) => [
      complaint.title || '',
      complaint.category || '',
      complaint.department || '',
      complaint.status || '',
      complaint.address || '',
      complaint.createdAt ? new Date(complaint.createdAt).toISOString() : '',
      complaint.upvoteCount ?? complaint.upvotes?.length ?? 0,
      complaint.feedback?.rating ?? ''
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `smart-city-complaints-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-cyan-500/20 bg-slate-900/90 p-4 text-sm sm:flex-row sm:items-center sm:justify-between shadow-glow backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 font-bold">
              🏛️
            </div>
            <div>
              <p className="font-bold text-white">Smart City Municipal Authority</p>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-cyan-300 font-semibold">{user?.name || 'Administrator'}</span> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAnalyticsModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-500/15 px-4 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/25 transition"
            >
              <span>📊</span> Department Analytics
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition"
            >
              <span>⬇️</span> Export CSV
            </button>
            <Link
              to="/map"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-cyan-300 transition"
            >
              🗺️ Heat Map
            </Link>
            <Link
              to="/complaints"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-cyan-300 transition"
            >
              📋 Complaints Feed
            </Link>

            <NotificationBell />

            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-4 py-2 font-semibold text-xs transition hover:bg-rose-500/30"
            >
              🔒 Admin Logout
            </button>
          </div>
        </div>

        {/* Ward Analytics Modal */}
        <WardAnalyticsModal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
        />

        {/* Dashboard Hero Header */}
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Admin Command Center</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Municipal Issue Management Overview</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Track real-time complaints, verify work with before-and-after photos, review citizen feedback, and update resolution statuses.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <DashboardCard label="Total" value={statistics.total} tone="slate" />
          <DashboardCard label="Submitted" value={statistics.submitted} tone="amber" />
          <DashboardCard label="Assigned" value={statistics.assigned} tone="cyan" />
          <DashboardCard label="In Progress" value={statistics.inProgress} tone="emerald" />
          <DashboardCard label="Resolved" value={statistics.resolved} tone="emerald" />
          <DashboardCard label="Rejected" value={statistics.rejected} tone="rose" />
        </section>

        <IssueAnalyticsCharts complaints={complaints} />

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Registered Users</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Website Users</h2>
            </div>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {users.length} Total
            </span>
          </div>

          {usersLoading ? (
            <p className="text-slate-300">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-slate-300">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((currentUser) => (
                    <tr key={currentUser.id || currentUser._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{currentUser.name}</td>
                      <td className="px-4 py-3 text-slate-300">{currentUser.email}</td>
                      <td className="px-4 py-3 text-slate-300">{currentUser.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-300">
                          {currentUser.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Search by title</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search complaints" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400">
                <option value="">All</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Filter by category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400">
                {categoryOptions.map((option) => (
                  <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Filter by department</span>
              <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400">
                {departmentOptions.map((option) => (
                  <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {loading ? <p className="text-slate-300">Loading dashboard...</p> : null}
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-glow backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Complaint</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Department Team</th>
                    <th className="px-6 py-4 font-semibold">Citizen Upvotes</th>
                    <th className="px-6 py-4 font-semibold">Citizen Rating</th>
                    <th className="px-6 py-4 font-semibold">Status & Remarks</th>
                    <th className="px-6 py-4 font-semibold">Created By</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{complaint.title}</p>
                            {complaint.isAnonymous ? (
                              <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                                🔒 Anon
                              </span>
                            ) : null}
                          </div>
                          <p className="max-w-md text-slate-400 line-clamp-2 text-xs">{complaint.description}</p>
                          <p className="text-[11px] text-slate-500">
                            📍 {complaint.address || `${complaint.latitude ?? ''}, ${complaint.longitude ?? ''}`}
                          </p>
                          {Array.isArray(complaint.resolutionImages) && complaint.resolutionImages.length > 0 ? (
                            <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                              ✓ {complaint.resolutionImages.length} Resolution Photos Attached
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const departmentTeam = complaint.departmentMembers?.length
                            ? complaint.departmentMembers
                            : getDepartmentTeam(complaint.category).members
                          const departmentName = complaint.department || getDepartmentTeam(complaint.category).department

                          return (
                            <div className="space-y-2 min-w-[180px]">
                              <p className="text-xs font-semibold text-teal-300">{departmentName}</p>
                              {departmentTeam.map((member) => (
                                <div key={`${complaint._id}-${member.name}`} className="rounded-xl border border-white/10 bg-slate-950/60 p-2 text-[11px] text-slate-300">
                                  <p className="font-semibold text-white">{member.name}</p>
                                  <p>{member.role}</p>
                                  <a href={`tel:${member.phone?.replace(/\s+/g, '')}`} className="text-cyan-300 hover:underline">
                                    {member.phone}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <UpvoteButton complaint={complaint} onUpvoteChange={handleUpvoteUpdate} />
                      </td>
                      <td className="px-6 py-4">
                        {complaint.feedback?.rating ? (
                          <div className="space-y-0.5">
                            <span className="text-amber-400 text-sm">
                              {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}
                            </span>
                            <p className="text-[11px] text-slate-300 font-semibold">{complaint.feedback.rating}/5 Stars</p>
                            {complaint.feedback.comment ? (
                              <p className="text-[11px] text-slate-400 italic line-clamp-1">"{complaint.feedback.comment}"</p>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">No feedback yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2 min-w-[200px]">
                          <select
                            value={statusById[complaint._id] || complaint.status}
                            onChange={(event) => setStatusById((current) => ({ ...current, [complaint._id]: event.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <textarea
                            rows="2"
                            value={remarksById[complaint._id] || ''}
                            onChange={(event) => setRemarksById((current) => ({ ...current, [complaint._id]: event.target.value }))}
                            placeholder="Official admin remarks"
                            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-slate-300">
                          <p className="font-medium text-xs">{complaint.createdBy?.name || 'Citizen'}</p>
                          <p className="text-[11px] text-slate-500">{complaint.createdBy?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-center text-xs font-semibold hover:bg-white/10" to={`/complaints/${complaint._id}`}>
                            Details
                          </Link>
                          <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-center text-xs font-semibold hover:bg-white/10" to={`/complaints/${complaint._id}/edit`}>
                            Edit / Proof
                          </Link>
                          <button
                            type="button"
                            disabled={savingId === complaint._id}
                            onClick={() => handleStatusSave(complaint._id)}
                            className="rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                          >
                            {savingId === complaint._id ? 'Saving...' : 'Save status'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}