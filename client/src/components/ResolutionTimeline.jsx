import { useMemo } from 'react'

const statusColorMap = {
  Submitted: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  Assigned: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300',
  'In Progress': 'border-indigo-400/40 bg-indigo-400/10 text-indigo-300',
  Resolved: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  Rejected: 'border-rose-400/40 bg-rose-400/10 text-rose-300'
}

const statusDotMap = {
  Submitted: 'bg-amber-400 shadow-amber-400/50',
  Assigned: 'bg-cyan-400 shadow-cyan-400/50',
  'In Progress': 'bg-indigo-400 shadow-indigo-400/50',
  Resolved: 'bg-emerald-400 shadow-emerald-400/50',
  Rejected: 'bg-rose-400 shadow-rose-400/50'
}

export function ResolutionTimeline({ timeline = [], currentStatus = 'Submitted' }) {
  const steps = useMemo(() => {
    if (Array.isArray(timeline) && timeline.length > 0) {
      return timeline
    }

    return [
      {
        status: currentStatus,
        action: 'Report Submitted',
        remarks: 'Complaint registered in the civic issue tracking system',
        timestamp: new Date()
      }
    ]
  }, [timeline, currentStatus])

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        ⏱️ Resolution Timeline & Status Tracking
      </h3>

      <div className="relative pl-6 before:absolute before:bottom-3 before:left-2.5 before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-indigo-400 before:to-emerald-400">
        <div className="space-y-6">
          {steps.map((event, index) => {
            const toneBadge = statusColorMap[event.status] || 'border-slate-400/40 bg-slate-400/10 text-slate-300'
            const toneDot = statusDotMap[event.status] || 'bg-slate-400 shadow-slate-400/50'
            const formattedDate = event.timestamp
              ? new Date(event.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Date recorded'

            return (
              <div key={index} className="relative group">
                <span
                  className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-slate-950 shadow-md transition-transform group-hover:scale-125 ${toneDot}`}
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneBadge}`}>
                      {event.status}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {event.action || `Status: ${event.status}`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{formattedDate}</span>
                </div>

                {event.remarks ? (
                  <p className="mt-2 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
                    {event.remarks}
                  </p>
                ) : null}

                {event.updatedBy?.name ? (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Updated by: <span className="text-slate-200">{event.updatedBy.name}</span>
                    {event.updatedBy.role ? ` (${event.updatedBy.role})` : ''}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
