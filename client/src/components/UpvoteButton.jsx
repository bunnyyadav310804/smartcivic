import { useState, useEffect } from 'react'
import { upvoteComplaint, removeUpvoteComplaint } from '../services/complaints.js'
import { useAuth } from '../context/AuthContext.jsx'

export function UpvoteButton({ complaint, onUpvoteChange }) {
  const { user } = useAuth()
  const userId = user?.id || user?._id

  const hasUserUpvoted = (upvotesArray) => {
    if (!Array.isArray(upvotesArray) || !userId) return false
    return upvotesArray.some((item) => {
      const id = typeof item === 'object' ? item._id || item.id : item
      return String(id) === String(userId)
    })
  }

  const [isUpvoted, setIsUpvoted] = useState(() => hasUserUpvoted(complaint?.upvotes))
  const [count, setCount] = useState(() => complaint?.upvotes?.length ?? complaint?.upvoteCount ?? 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsUpvoted(hasUserUpvoted(complaint?.upvotes))
    setCount(complaint?.upvotes?.length ?? complaint?.upvoteCount ?? 0)
  }, [complaint, userId])

  async function handleToggleUpvote(event) {
    event.preventDefault()
    event.stopPropagation()

    if (!userId || loading || !complaint?._id) return

    setLoading(true)
    const prevIsUpvoted = isUpvoted
    const prevCount = count

    // Optimistic UI update
    const nextIsUpvoted = !prevIsUpvoted
    const nextCount = nextIsUpvoted ? prevCount + 1 : Math.max(0, prevCount - 1)
    setIsUpvoted(nextIsUpvoted)
    setCount(nextCount)

    try {
      if (prevIsUpvoted) {
        const response = await removeUpvoteComplaint(complaint._id)
        if (response?.complaint) {
          onUpvoteChange?.(response.complaint)
        }
      } else {
        const response = await upvoteComplaint(complaint._id)
        if (response?.complaint) {
          onUpvoteChange?.(response.complaint)
        }
      }
    } catch (error) {
      // Revert optimistic update on failure
      setIsUpvoted(prevIsUpvoted)
      setCount(prevCount)
      console.error('Failed to toggle upvote:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleUpvote}
      disabled={loading || !userId}
      title={isUpvoted ? 'Remove your upvote' : 'Upvote this complaint'}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition border ${
        isUpvoted
          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-glow'
          : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300'
      } disabled:opacity-50 cursor-pointer`}
    >
      <span className={`transition-transform duration-200 ${isUpvoted ? 'scale-110' : ''}`}>
        👍
      </span>
      <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
      <span className="ml-1 rounded-full bg-slate-950/60 px-2 py-0.5 text-[11px] font-bold text-slate-200 border border-white/10">
        {count}
      </span>
    </button>
  )
}
