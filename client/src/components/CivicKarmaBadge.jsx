import { useKarma } from '../context/KarmaContext.jsx'

export function CivicKarmaBadge() {
  const { karmaPoints, badgeTitle, badgeColor } = useKarma()

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-3.5 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${badgeColor}`}>
      <span>{badgeTitle}</span>
      <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white font-mono">
        {karmaPoints} pts
      </span>
    </div>
  )
}
