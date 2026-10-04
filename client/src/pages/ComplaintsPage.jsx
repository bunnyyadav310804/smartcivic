import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteComplaint, fetchComplaints } from '../services/complaints.js'
import { UpvoteButton } from '../components/UpvoteButton.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'

export function ComplaintsPage({ refreshKey }) {
  const { t } = useTranslation()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filterCategories = useMemo(() => [
    { key: 'All', label: t('all_filter') },
    { key: 'Potholes / Road Damage', label: t('cat_potholes') },
    { key: 'Garbage & Sanitation', label: t('cat_garbage') },
    { key: 'Drainage Blockage', label: t('cat_drainage') },
    { key: 'Water Leakage', label: t('cat_water') },
    { key: 'Damaged Streetlights', label: t('cat_streetlights') },
    { key: 'Electricity & Hazards', label: t('cat_electricity') }
  ], [t])

  useEffect(() => {
    let mounted = true

    async function loadComplaints() {
      setLoading(true)
      setError('')

      try {
        const complaintList = await fetchComplaints()
        if (mounted) setComplaints(complaintList)
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadComplaints()

    return () => {
      mounted = false
    }
  }, [refreshKey])

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return
    setDeletingId(id)
    setError('')
    try {
      await deleteComplaint(id)
      const nextComplaints = await fetchComplaints()
      setComplaints(nextComplaints)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setDeletingId('')
    }
  }

  function handleUpvoteUpdate(updatedComplaint) {
    setComplaints((current) =>
      current.map((c) => (c._id === updatedComplaint._id ? { ...c, ...updatedComplaint } : c))
    )
  }

  function getStatusLabel(status) {
    if (status === 'Submitted') return t('stat_submitted')
    if (status === 'Assigned') return t('stat_assigned')
    if (status === 'In Progress') return t('stat_in_progress')
    if (status === 'Resolved') return t('stat_resolved')
    if (status === 'Rejected') return t('stat_rejected')
    return status
  }

  function getPriorityLabel(priority) {
    if (priority === 'Low') return t('prio_low')
    if (priority === 'Medium') return t('prio_medium')
    if (priority === 'High') return t('prio_high')
    if (priority === 'Critical') return t('prio_critical')
    return `${priority} priority`
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' ||
        c.category === selectedCategory ||
        (selectedCategory === 'Potholes / Road Damage' && c.category === 'Roads') ||
        (selectedCategory === 'Garbage & Sanitation' && c.category === 'Sanitation') ||
        (selectedCategory === 'Water Leakage' && c.category === 'Water') ||
        (selectedCategory === 'Electricity & Hazards' && c.category === 'Electricity')

      return matchesSearch && matchesCategory
    })
  }, [complaints, searchQuery, selectedCategory])

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-glow backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('complaints_registry_title')}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {t('complaints_registry_subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            to="/map"
          >
            {t('city_heat_map')}
          </Link>
          <Link
            className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
            to="/complaints/new"
          >
            {t('report_new_issue')}
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 ${t('search_placeholder')}`}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1">{t('category')}:</span>
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat.key
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="text-slate-300">Loading...</p> : null}
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p> : null}

      {!loading && !error && filteredComplaints.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-slate-400 text-lg">{t('no_complaints_found')}</p>
          <Link className="inline-block mt-4 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950" to="/complaints/new">
            {t('report_new_issue')}
          </Link>
        </div>
      ) : null}

      {!loading && !error && filteredComplaints.length > 0 ? (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <article key={complaint._id} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                    {complaint.isAnonymous ? (
                      <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        🔒 {t('anonymous_reporting')}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-cyan-400/15 px-2.5 py-0.5 font-medium text-cyan-300 border border-cyan-400/30">
                      {complaint.category}
                    </span>
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 font-medium text-emerald-300 border border-emerald-400/30">
                      {getStatusLabel(complaint.status)}
                    </span>
                    <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 font-medium text-amber-300 border border-amber-400/30">
                      {getPriorityLabel(complaint.priority)}
                    </span>
                    {Array.isArray(complaint.resolutionImages) && complaint.resolutionImages.length > 0 ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-300 border border-emerald-500/30">
                        {t('verified_proof')}
                      </span>
                    ) : null}
                    {complaint.feedback?.rating ? (
                      <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 font-bold text-amber-300 border border-amber-400/30">
                        ★ {complaint.feedback.rating}/5
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-400 pt-1">
                    📍 {t('location')}: {complaint.address || `${complaint.latitude ?? 'N/A'}, ${complaint.longitude ?? 'N/A'}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <UpvoteButton complaint={complaint} onUpvoteChange={handleUpvoteUpdate} />
                  <Link className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-300" to={`/complaints/${complaint._id}`}>
                    {t('view_details')}
                  </Link>
                  <Link className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-300" to={`/complaints/${complaint._id}/edit`}>
                    {t('edit')}
                  </Link>
                  <button
                    className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-400/20 disabled:opacity-50"
                    type="button"
                    disabled={deletingId === complaint._id}
                    onClick={() => handleDelete(complaint._id)}
                  >
                    {deletingId === complaint._id ? '...' : t('delete')}
                  </button>
                </div>
              </div>

              {Array.isArray(complaint.images) && complaint.images.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {complaint.images.slice(0, 3).map((imageUrl, idx) => (
                    <img key={imageUrl} src={imageUrl} alt={`Complaint thumbnail ${idx + 1}`} className="h-20 w-full rounded-2xl object-cover" />
                  ))}
                </div>
              ) : null}

              <p className="mt-3 text-sm text-slate-300 line-clamp-2">{complaint.description}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}