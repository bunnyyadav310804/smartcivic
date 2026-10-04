export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]" />
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 sm:px-10 lg:px-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl sm:p-10">
              <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                Smart Civic Issue Reporting System
              </div>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{subtitle}</p>
            </section>

            <aside className="rounded-[2rem] border border-emerald-300/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl sm:p-8">
              {children}
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}