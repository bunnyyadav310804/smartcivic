import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteComplaint, fetchComplaint, submitComplaintFeedback } from '../services/complaints.js'
import { useAuth } from '../context/AuthContext.jsx'
import { UpvoteButton } from '../components/UpvoteButton.jsx'
import { ResolutionTimeline } from '../components/ResolutionTimeline.jsx'
import { generateComplaintPDF } from '../utils/pdfGenerator.js'
import { validateResolutionProof } from '../services/aiResolutionValidator.js'
import { useTranslation } from '../context/LanguageContext.jsx'

export function ComplaintDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // Citizen Feedback state
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadComplaint() {
      try {
        const data = await fetchComplaint(id)
        if (mounted) setComplaint(data)
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || requestError.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadComplaint()

    return () => {
      mounted = false
    }
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return
    setDeleting(true)
    try {
      await deleteComplaint(id)
      navigate('/complaints')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setDeleting(false)
    }
  }

  function handleUpvoteUpdate(updatedComplaint) {
    setComplaint((current) => ({ ...current, ...updatedComplaint }))
  }

  function handleWhatsAppShare() {
    if (!complaint) return
    const text = `🚨 *Smart Civic Issue Report* 🚨\n\n📌 *Title:* ${complaint.title}\n📂 *Category:* ${complaint.category}\n⚡ *Status:* ${complaint.status}\n📍 *Location:* ${complaint.address || `${complaint.latitude}, ${complaint.longitude}`}\n\nTrack progress or upvote here:\n${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  async function handleFeedbackSubmit(e) {
    e.preventDefault()
    setSubmittingFeedback(true)
    setFeedbackError('')
    setFeedbackSuccess('')

    try {
      const updated = await submitComplaintFeedback(id, {
        rating: feedbackRating,
        comment: feedbackComment
      })
      setComplaint(updated)
      setFeedbackSuccess('Thank you for rating this civic resolution!')
    } catch (err) {
      setFeedbackError(err.response?.data?.message || err.message)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const isOwnerOrAdmin =
    user &&
    complaint &&
    (complaint.createdBy?._id === user.id ||
      complaint.createdBy?._id === user._id ||
      complaint.createdBy === user.id ||
      complaint.createdBy === user._id ||
      user.role === 'Admin')

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-glow backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200" to="/complaints">
          {t('back_to_complaints')}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {complaint ? <UpvoteButton complaint={complaint} onUpvoteChange={handleUpvoteUpdate} /> : null}

          {/* PDF Work Order Export Button */}
          {complaint ? (
            <button
              type="button"
              onClick={() => generateComplaintPDF(complaint)}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-xs font-bold text-sky-300 transition hover:bg-sky-500/25"
            >
              <span>📄</span> {t('export_pdf')}
            </button>
          ) : null}

          {/* WhatsApp Share Button */}
          {complaint ? (
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/25"
            >
              <span>💬</span> {t('share_whatsapp')}
            </button>
          ) : null}

          {isOwnerOrAdmin && complaint ? (
            <>
              <Link
                to={`/complaints/${complaint._id}/edit`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                {t('edit_complaint')}
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
              >
                {deleting ? '...' : t('delete_complaint')}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {loading ? <p className="text-slate-300">Loading complaint details...</p> : null}
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p> : null}

      {complaint ? (
        <article className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {complaint.isAnonymous ? (
                  <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                    🔒 Anonymous Report
                  </span>
                ) : null}
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">{complaint.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {complaint.category}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {complaint.status}
              </span>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                Priority: {complaint.priority}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Description</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-200">{complaint.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">📍 Location Details</h3>
              <p className="text-sm text-slate-300"><span className="text-slate-400">Address:</span> {complaint.address || 'Not specified'}</p>
              <p className="text-sm text-slate-300"><span className="text-slate-400">Latitude:</span> {complaint.latitude ?? 'N/A'}</p>
              <p className="text-sm text-slate-300"><span className="text-slate-400">Longitude:</span> {complaint.longitude ?? 'N/A'}</p>
              {complaint.latitude && complaint.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-cyan-300 underline hover:text-cyan-200"
                >
                  View Location on Google Maps ↗
                </a>
              ) : null}
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">👤 Reporter & Administrative Info</h3>
              <p className="text-sm text-slate-300">
                <span className="text-slate-400">Reported By:</span>{' '}
                <span className="font-semibold text-white">
                  {complaint.isAnonymous && user?.role !== 'Admin' && (!user || (complaint.createdBy?._id !== user.id && complaint.createdBy !== user.id))
                    ? 'Anonymous Citizen'
                    : complaint.createdBy?.name || 'Citizen'}
                </span>
              </p>
              {!complaint.isAnonymous || user?.role === 'Admin' ? (
                <>
                  <p className="text-sm text-slate-300"><span className="text-slate-400">Contact Email:</span> {complaint.createdBy?.email || 'N/A'}</p>
                  <p className="text-sm text-slate-300"><span className="text-slate-400">Contact Phone:</span> {complaint.createdBy?.phone || 'N/A'}</p>
                </>
              ) : null}
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-sm font-medium text-slate-300">Official Municipal Remarks:</p>
                <p className="mt-1 text-sm italic text-slate-400">{complaint.remarks || 'No official remarks added yet.'}</p>
              </div>
            </div>
          </div>

          {/* Before & After Resolution Images Gallery */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                  📸 Before Resolution
                </span>
                <span className="text-sm font-semibold text-slate-300">Original Citizen Evidence Photos</span>
              </div>
              {Array.isArray(complaint.images) && complaint.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {complaint.images.map((imageUrl, idx) => (
                    <a key={imageUrl} href={imageUrl} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                      <img src={imageUrl} alt={`Before resolution ${idx + 1}`} className="h-40 w-full object-cover transition group-hover:scale-105" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No original evidence photos attached.</p>
              )}
            </div>

            {/* After Resolution Images */}
            {Array.isArray(complaint.resolutionImages) && complaint.resolutionImages.length > 0 ? (() => {
              const aiValidation = validateResolutionProof(complaint.images, complaint.resolutionImages, complaint.category)
              return (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                        ✅ After Resolution (Verified Proof)
                      </span>
                      <span className="text-xs font-semibold text-emerald-200">Work Completed by Municipal Authority</span>
                    </div>

                    {/* AI Resolution Verification Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 shadow-sm">
                      <span>🤖</span>
                      <span>AI Verified: {aiValidation.confidenceScore}% Confidence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {complaint.resolutionImages.map((imageUrl, idx) => (
                      <a key={imageUrl} href={imageUrl} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-emerald-400/30 bg-slate-950 shadow-glow">
                        <img src={imageUrl} alt={`After resolution ${idx + 1}`} className="h-40 w-full object-cover transition group-hover:scale-105" />
                      </a>
                    ))}
                  </div>

                  <div className="rounded-xl border border-teal-400/20 bg-slate-950/60 p-3 text-xs text-teal-200">
                    <p className="font-semibold text-teal-300">🔍 {aiValidation.verdict}</p>
                    <div className="mt-1 flex flex-wrap gap-4 text-[11px] text-slate-400">
                      <span>Scene Match: <strong className="text-white">{aiValidation.analysisMetrics.sceneMatchPercentage}%</strong></span>
                      <span>Hazard Mitigation: <strong className="text-emerald-300">{aiValidation.analysisMetrics.hazardMitigationRate}%</strong></span>
                      <span>Integrity: <strong className="text-cyan-300">{aiValidation.analysisMetrics.structuralIntegrity}</strong></span>
                    </div>
                  </div>
                </div>
              )
            })() : null}
          </div>

          {/* Citizen Feedback & 5-Star Rating Section (for Resolved complaints) */}
          {complaint.status === 'Resolved' ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ⭐ Citizen Resolution Feedback & Rating
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Help us improve public service delivery by rating how well this civic problem was resolved.
              </p>

              {complaint.feedback?.rating ? (
                <div className="mt-4 rounded-xl border border-emerald-400/20 bg-slate-950/80 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-amber-400">
                      {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}
                    </span>
                    <span className="font-bold text-sm text-emerald-300">
                      {complaint.feedback.rating}/5 Stars
                    </span>
                  </div>
                  {complaint.feedback.comment ? (
                    <p className="mt-2 text-sm text-slate-200 italic">"{complaint.feedback.comment}"</p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-slate-400">
                    Feedback submitted on {new Date(complaint.feedback.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Rating:</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`text-2xl transition ${
                            star <= feedbackRating ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-amber-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-amber-300">{feedbackRating} out of 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Comments (Optional):</label>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Was the problem resolved satisfactorily? Any observations..."
                      rows="2"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {feedbackSuccess ? (
                    <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-300">
                      {feedbackSuccess}
                    </p>
                  ) : null}

                  {feedbackError ? (
                    <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-300">
                      {feedbackError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Citizen Rating'}
                  </button>
                </form>
              )}
            </div>
          ) : null}

          {/* Step-by-Step Resolution Timeline */}
          <ResolutionTimeline timeline={complaint.timeline} currentStatus={complaint.status} />
        </article>
      ) : null}
    </section>
  )
}