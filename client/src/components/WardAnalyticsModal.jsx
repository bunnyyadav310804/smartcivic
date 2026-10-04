import { useState } from 'react'

const departmentData = [
  {
    name: 'Roads & Infrastructure (PWD)',
    category: 'Potholes / Road Damage',
    officer: 'Er. Rajesh Kumar',
    totalTickets: 24,
    resolvedTickets: 19,
    avgTurnaroundHours: 36,
    satisfactionScore: 4.6,
    status: 'High Efficiency'
  },
  {
    name: 'Solid Waste & Sanitation Board',
    category: 'Garbage & Sanitation',
    officer: 'Dr. Priya Sharma',
    totalTickets: 42,
    resolvedTickets: 38,
    avgTurnaroundHours: 18,
    satisfactionScore: 4.8,
    status: 'Top Performer'
  },
  {
    name: 'Water Supply & Sewerage Board (BWSSB)',
    category: 'Water Leakage / Drainage',
    officer: 'Er. Ananth Rao',
    totalTickets: 18,
    resolvedTickets: 14,
    avgTurnaroundHours: 28,
    satisfactionScore: 4.4,
    status: 'Good'
  },
  {
    name: 'City Electricity Board (BESCOM)',
    category: 'Damaged Streetlights / Hazards',
    officer: 'Er. Sandeep Reddy',
    totalTickets: 15,
    resolvedTickets: 13,
    avgTurnaroundHours: 12,
    satisfactionScore: 4.9,
    status: 'Rapid Response'
  }
]

export function WardAnalyticsModal({ isOpen, onClose }) {
  const [selectedWard, setSelectedWard] = useState('Central Zone (Ward 4-7)')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              📊 Municipal Governance Analytics
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Ward & Department Performance Scorecard
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950/60 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Jurisdiction:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="Central Zone (Ward 4-7)">Central Zone (Ward 4-7)</option>
              <option value="North Zone (Ward 1-3)">North Zone (Ward 1-3)</option>
              <option value="South Zone (Ward 8-12)">South Zone (Ward 8-12)</option>
              <option value="East Zone (Ward 13-16)">East Zone (Ward 13-16)</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-emerald-300">
            ✓ Live Municipal Performance Index: 92.4%
          </span>
        </div>

        {/* Department cards */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {departmentData.map((dept) => {
            const resolutionRate = Math.round((dept.resolvedTickets / dept.totalTickets) * 100)
            return (
              <div
                key={dept.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{dept.name}</h3>
                    <p className="text-[11px] text-slate-400">Lead: {dept.officer}</p>
                  </div>
                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                    {dept.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2 text-center">
                  <div className="rounded-xl bg-slate-950/50 p-2">
                    <p className="text-[10px] text-slate-400">Resolution</p>
                    <p className="text-xs font-bold text-emerald-300">{resolutionRate}%</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/50 p-2">
                    <p className="text-[10px] text-slate-400">Avg Response</p>
                    <p className="text-xs font-bold text-cyan-300">{dept.avgTurnaroundHours}h</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/50 p-2">
                    <p className="text-[10px] text-slate-400">Citizen CSAT</p>
                    <p className="text-xs font-bold text-amber-300">★ {dept.satisfactionScore}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Resolved: {dept.resolvedTickets} / {dept.totalTickets} tickets</span>
                    <span>{resolutionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
          >
            Close Analytics Scorecard
          </button>
        </div>
      </div>
    </div>
  )
}
