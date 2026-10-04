export function DashboardCard({ label, value, tone = 'cyan' }) {
  const toneClasses = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    rose: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
    slate: 'border-white/10 bg-white/5 text-slate-100'
  }

  return (
    <div className={`rounded-3xl border p-5 shadow-glow ${toneClasses[tone] || toneClasses.slate}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-inherit/80">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-inherit">{value}</p>
    </div>
  )
}