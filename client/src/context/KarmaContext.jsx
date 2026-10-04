import { createContext, useContext, useEffect, useState } from 'react'

const KarmaContext = createContext(null)
const KARMA_STORAGE_KEY = 'smart_civic_karma_points'

export function KarmaProvider({ children }) {
  const [karmaPoints, setKarmaPoints] = useState(() => {
    try {
      const stored = localStorage.getItem(KARMA_STORAGE_KEY)
      return stored ? parseInt(stored, 10) : 150
    } catch {
      return 150
    }
  })

  useEffect(() => {
    localStorage.setItem(KARMA_STORAGE_KEY, String(karmaPoints))
  }, [karmaPoints])

  function addKarma(points, reason = '') {
    setKarmaPoints((prev) => prev + points)
  }

  // Calculate Badge Tier
  let badgeTitle = '🥉 Civic Pioneer'
  let badgeColor = 'from-amber-700/30 to-amber-900/30 border-amber-600/40 text-amber-300'
  let nextTierPoints = 300

  if (karmaPoints >= 600) {
    badgeTitle = '👑 Smart City Hero'
    badgeColor = 'from-yellow-400/30 to-amber-500/30 border-yellow-400/50 text-yellow-300'
    nextTierPoints = 1000
  } else if (karmaPoints >= 300) {
    badgeTitle = '🥈 Community Guardian'
    badgeColor = 'from-cyan-400/30 to-blue-500/30 border-cyan-400/50 text-cyan-300'
    nextTierPoints = 600
  }

  return (
    <KarmaContext.Provider
      value={{
        karmaPoints,
        badgeTitle,
        badgeColor,
        nextTierPoints,
        addKarma
      }}
    >
      {children}
    </KarmaContext.Provider>
  )
}

export function useKarma() {
  const context = useContext(KarmaContext)
  if (!context) {
    throw new Error('useKarma must be used within KarmaProvider')
  }
  return context
}
