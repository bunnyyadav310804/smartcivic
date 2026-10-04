import { useId } from 'react'
import { ComplaintMapView } from './ComplaintMapView.jsx'

const COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#f87171', '#60a5fa']

function buildDemoDuplicateComplaints() {
  return [
    {
      _id: 'demo-duplicate-1',
      title: 'Drainage blockage near public park',
      category: 'Drainage Blockage',
      department: 'Storm Water Management',
      status: 'Submitted',
      address: 'Ward 12, MG Road, City Center',
      latitude: 12.9716,
      longitude: 77.5946,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
    },
    {
      _id: 'demo-duplicate-2',
      title: 'Water logging at MG Road junction',
      category: 'Drainage Blockage',
      department: 'Storm Water Management',
      status: 'Assigned',
      address: 'Ward 12, MG Road, City Center',
      latitude: 12.9717,
      longitude: 77.5948,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    },
    {
      _id: 'demo-duplicate-3',
      title: 'Streetlight not working near city square',
      category: 'Damaged Streetlights',
      department: 'Electrical Maintenance Division',
      status: 'In Progress',
      address: 'Ward 06, City Square, Central Avenue',
      latitude: 12.9795,
      longitude: 77.5913,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString()
    },
    {
      _id: 'demo-duplicate-4',
      title: 'Broken street lamp in central avenue',
      category: 'Damaged Streetlights',
      department: 'Electrical Maintenance Division',
      status: 'Resolved',
      address: 'Ward 06, City Square, Central Avenue',
      latitude: 12.9794,
      longitude: 77.5911,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
    },
    {
      _id: 'demo-duplicate-5',
      title: 'Pothole causing traffic jam near school',
      category: 'Potholes / Road Damage',
      department: 'Roads & Transport Department',
      status: 'Submitted',
      address: 'Ward 08, School Road, Green Park',
      latitude: 12.9655,
      longitude: 77.6012,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
    },
    {
      _id: 'demo-duplicate-6',
      title: 'Bad road surface near School Road',
      category: 'Potholes / Road Damage',
      department: 'Roads & Transport Department',
      status: 'Assigned',
      address: 'Ward 08, School Road, Green Park',
      latitude: 12.9659,
      longitude: 77.6018,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    },
    {
      _id: 'demo-duplicate-7',
      title: 'Garbage heaps spreading near temple lane',
      category: 'Garbage & Sanitation',
      department: 'Sanitation Department',
      status: 'Submitted',
      address: 'Ward 03, Temple Lane, Old Town',
      latitude: 12.9606,
      longitude: 77.6047,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    },
    {
      _id: 'demo-duplicate-8',
      title: 'Overflowing bins on temple road',
      category: 'Garbage & Sanitation',
      department: 'Sanitation Department',
      status: 'In Progress',
      address: 'Ward 03, Temple Lane, Old Town',
      latitude: 12.9609,
      longitude: 77.6048,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
    },
    {
      _id: 'demo-duplicate-9',
      title: 'Pothole near market bus stop',
      category: 'Potholes / Road Damage',
      department: 'Roads & Transport Department',
      status: 'Submitted',
      address: 'Ward 15, Market Bus Stand',
      latitude: 12.9728,
      longitude: 77.6087,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
    },
    {
      _id: 'demo-duplicate-10',
      title: 'Broken streetlight near market bus stop',
      category: 'Damaged Streetlights',
      department: 'Electrical Maintenance Division',
      status: 'Assigned',
      address: 'Ward 15, Market Bus Stand',
      latitude: 12.9727,
      longitude: 77.6083,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
    }
  ]
}

function getDuplicateSummary(items) {
  const clusterMap = new Map()

  items.forEach((item) => {
    const category = item.category || 'Other'
    const lat = Number(item.latitude)
    const lon = Number(item.longitude)
    const address = (item.address || '').trim()
    const locationKey = Number.isFinite(lat) && Number.isFinite(lon)
      ? `${category}:${lat.toFixed(3)}:${lon.toFixed(3)}`
      : `${category}:${address.toLowerCase()}`

    clusterMap.set(locationKey, (clusterMap.get(locationKey) || 0) + 1)
  })

  const duplicateClusters = Array.from(clusterMap.values()).filter((count) => count > 1).length
  const duplicateReports = items.length - clusterMap.size

  return {
    duplicateClusters,
    duplicateReports
  }
}

function groupBy(items, key) {
  const grouped = new Map()

  items.forEach((item) => {
    const value = item?.[key]
    const label = typeof value === 'string' ? value.trim() : (value || 'Other')

    if (!label) return

    grouped.set(label, (grouped.get(label) || 0) + 1)
  })

  return Array.from(grouped.entries())
    .map(([label, count], index) => ({
      label,
      count,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.count - a.count)
}

function buildMonthlyTrend(complaints) {
  const buckets = new Map()

  complaints.forEach((complaint) => {
    const dateValue = complaint.createdAt || complaint.created_at || complaint.date
    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) return

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)

    buckets.set(key, {
      label,
      count: (buckets.get(key)?.count || 0) + 1
    })
  })

  return Array.from(buckets.entries())
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6)
    .map(({ key, ...rest }) => rest)
}

function getWardHotspots(complaints) {
  const wardMap = new Map()

  complaints.forEach((complaint) => {
    const address = complaint.address || ''
    const directMatch = address.match(/ward\s*[- ]?\d+/i) || address.match(/ward\s*[a-z0-9-]+/i)
    const localityMatch = address.split(',')[0]?.trim()
    const label = directMatch ? directMatch[0].replace(/\s+/g, ' ').trim() : (localityMatch || 'Unassigned Ward')

    if (!label) return

    wardMap.set(label, (wardMap.get(label) || 0) + 1)
  })

  return Array.from(wardMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function DonutChart({ data, total }) {
  if (!data.length) {
    return (
      <div className="flex h-[210px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-400">
        No data
      </div>
    )
  }

  const radius = 54
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative h-[180px] w-[180px] drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="16" />
          {data.map((item) => {
            const proportion = total ? item.count / total : 0
            const segmentLength = proportion * circumference
            const dashOffset = -offset
            offset += segmentLength

            return (
              <circle
                key={item.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={dashOffset}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white">{total}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">issues</span>
        </div>
      </div>

      <div className="w-full space-y-3 md:max-w-[240px]">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-2.5 py-2 text-xs text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_16px_rgba(255,255,255,0.45)]" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
            <span className="font-semibold text-white">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBarChart({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-400">
        No status data
      </div>
    )
  }

  const max = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col justify-end gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-3 shadow-[0_14px_35px_rgba(15,23,42,0.22)]">
          <div className="flex h-28 items-end justify-center rounded-xl bg-slate-900/80 p-2">
            <div
              className="w-full rounded-xl shadow-[0_0_18px_rgba(34,211,238,0.18)]"
              style={{
                height: `${(item.count / max) * 100}%`,
                background: `linear-gradient(180deg, ${item.color}, rgba(15, 23, 42, 0.5))`
              }}
            />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">{item.count}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrendChart({ data }) {
  const gradientId = useId()

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-400">
        No trend data
      </div>
    )
  }

  const width = 420
  const height = 200
  const padding = 22
  const max = Math.max(...data.map((item) => item.count), 1)
  const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0

  const points = data.map((item, index) => {
    const x = padding + index * step
    const y = height - padding - (item.count / max) * (height - padding * 2)
    return { x, y, ...item }
  })

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPoints = `${linePoints} ${width - padding},${height - padding} ${padding},${height - padding}`

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.05)" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((tick) => (
          <line
            key={tick}
            x1={padding}
            x2={width - padding}
            y1={padding + tick * 40}
            y2={padding + tick * 40}
            stroke="rgba(148,163,184,0.12)"
            strokeDasharray="3 6"
          />
        ))}

        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          fill="none"
          stroke="#22d3ee"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={linePoints}
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" fill="#a5f3fc" stroke="#082f49" strokeWidth="2" />
            <text x={point.x} y={height - 6} textAnchor="middle" fill="#cbd5e1" fontSize="10">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
        <span>Last 6 months</span>
        <span>{Math.max(...data.map((item) => item.count))} peak</span>
      </div>
    </div>
  )
}

function HotspotList({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-400">
        No hotspot data
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
          <div>
            <p className="text-sm font-semibold text-white">{item.label}</p>
            <p className="text-[11px] text-slate-400">{item.count} reported issues</p>
          </div>
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
            #{index + 1}
          </span>
        </div>
      ))}
    </div>
  )
}

export function IssueAnalyticsCharts({ complaints = [] }) {
  const demoComplaints = buildDemoDuplicateComplaints()
  const visibleComplaints = complaints.length > 3
    ? complaints
    : [...demoComplaints, ...complaints].slice(0, 12)
  const categoryData = groupBy(visibleComplaints, 'category')
  const statusData = groupBy(visibleComplaints, 'status')
  const departmentData = groupBy(visibleComplaints, 'department')
  const monthlyTrendData = buildMonthlyTrend(visibleComplaints)
  const hotspotData = getWardHotspots(visibleComplaints)
  const duplicateSummary = getDuplicateSummary(visibleComplaints)
  const total = visibleComplaints.length || 0

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.7rem] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 px-4 py-3 text-sm text-slate-200 shadow-[0_20px_50px_rgba(34,211,238,0.08)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">Analytics overview</p>
          <p className="mt-1 text-base font-semibold text-white">
            {duplicateSummary.duplicateReports > 0 ? `${duplicateSummary.duplicateReports} duplicate reports detected` : 'No duplicate clusters found'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300">
            {duplicateSummary.duplicateClusters} duplicate clusters
          </span>
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-semibold text-violet-300">
            {total} total issues
          </span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300">Default analysis</p>
              <h3 className="mt-2 text-xl font-bold text-white">Category pie chart</h3>
            </div>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {total} reports
            </span>
          </div>

          <DonutChart data={categoryData} total={total || categoryData.reduce((sum, item) => sum + item.count, 0)} />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-300">Operations</p>
              <h3 className="mt-2 text-xl font-bold text-white">Status bar graph</h3>
            </div>
          </div>

          <StatusBarChart data={statusData} />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300">Hotspots</p>
              <h3 className="mt-2 text-xl font-bold text-white">Issue heat map</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
            <ComplaintMapView complaints={visibleComplaints} height="260px" showHeatmap={true} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/30 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-violet-300">Departments</p>
              <h3 className="mt-2 text-xl font-bold text-white">Department donut</h3>
            </div>
          </div>

          <DonutChart data={departmentData} total={total || departmentData.reduce((sum, item) => sum + item.count, 0)} />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-300">Trend</p>
              <h3 className="mt-2 text-xl font-bold text-white">Monthly volume</h3>
            </div>
          </div>

          <TrendChart data={monthlyTrendData} />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 p-5 shadow-[0_20px_60px_rgba(8,15,28,0.7)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300">Priority</p>
              <h3 className="mt-2 text-xl font-bold text-white">Top ward hotspots</h3>
            </div>
          </div>

          <HotspotList data={hotspotData} />
        </div>
      </div>
    </section>
  )
}
