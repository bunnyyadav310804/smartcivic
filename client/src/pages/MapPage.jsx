import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ComplaintMapView } from '../components/ComplaintMapView.jsx'
import { fetchComplaints } from '../services/complaints.js'

const categories = [
  'All',
  'Potholes / Road Damage',
  'Garbage & Sanitation',
  'Drainage Blockage',
  'Water Leakage',
  'Damaged Streetlights',
  'Electricity & Hazards',
  'Other'
]

const statusList = ['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected']

export function MapPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showHeatmap, setShowHeatmap] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const list = await fetchComplaints()
        if (mounted) setComplaints(list)
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchCat =
        selectedCategory === 'All' ||
        c.category === selectedCategory ||
        (selectedCategory === 'Potholes / Road Damage' && c.category === 'Roads') ||
        (selectedCategory === 'Garbage & Sanitation' && c.category === 'Sanitation') ||
        (selectedCategory === 'Water Leakage' && c.category === 'Water') ||
        (selectedCategory === 'Electricity & Hazards' && c.category === 'Electricity')

      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus

      return matchCat && matchStatus
    })
  }, [complaints, selectedCategory, selectedStatus])

  const pinnedCount = filteredComplaints.filter((c) => c.latitude != null && c.longitude != null).length

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-glow backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            🗺️ Spatial GIS & Heatmap
          </div>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">City Civic Issue Heat Map</h2>
          <p className="text-sm text-slate-400">
            Real-time geospatial visualization of reported civic problems and density clusters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHeatmap((prev) => !prev)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              showHeatmap
                ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-glow'
                : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            🔥 Heatmap Circles: {showHeatmap ? 'ON' : 'OFF'}
          </button>
          <Link
            className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
            to="/complaints/new"
          >
            + Report Issue
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-300">Filter by Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-300">Filter by Status</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          >
            {statusList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col justify-end">
          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-xs text-slate-300">
            <span className="font-semibold text-cyan-300">{pinnedCount}</span> pinned issues matching filter
          </div>
        </div>
      </div>

      {loading ? <p className="text-slate-300">Loading map data...</p> : null}
      {error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <ComplaintMapView complaints={filteredComplaints} height="560px" showHeatmap={showHeatmap} />

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Map Legend:</span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Potholes / Roads
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Sanitation
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyan-400">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Drainage & Water
              </span>
              <span className="inline-flex items-center gap-1.5 text-yellow-400">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Streetlights
              </span>
              <span className="inline-flex items-center gap-1.5 text-violet-400">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Electricity
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
