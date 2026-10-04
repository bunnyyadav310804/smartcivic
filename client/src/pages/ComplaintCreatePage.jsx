import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ComplaintForm } from '../components/ComplaintForm.jsx'
import { UpvoteButton } from '../components/UpvoteButton.jsx'
import { checkDuplicateComplaints, createComplaint, fetchComplaints } from '../services/complaints.js'
import { buildComplaintFormData } from '../services/complaintFormData.js'
import { findAISimilarComplaints } from '../services/aiSimilarityService.js'
import { evaluateHazardUrgency } from '../services/aiHazardEscalator.js'
import { useTranslation } from '../context/LanguageContext.jsx'

const initialState = {
  title: '',
  description: '',
  category: '',
  latitude: '',
  longitude: '',
  address: '',
  status: 'Submitted',
  priority: 'Medium',
  isAnonymous: false,
  remarks: ''
}

export function ComplaintCreatePage({ onSaved }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState([])
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [dismissDuplicates, setDismissDuplicates] = useState(false)

  // AI features state
  const [allComplaints, setAllComplaints] = useState([])
  const [aiSimilarMatches, setAiSimilarMatches] = useState([])
  const [aiHazardAlert, setAiHazardAlert] = useState(null)

  const canEditStatus = false
  const baseLocationSupported = useMemo(() => Boolean(navigator.geolocation), [])

  useEffect(() => {
    fetchComplaints()
      .then((data) => setAllComplaints(data || []))
      .catch(() => {})
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    const nextFormData = { ...formData, [name]: value }
    setFormData(nextFormData)
    setDismissDuplicates(false)

    // Evaluate AI Hazard Urgency in real time
    const hazard = evaluateHazardUrgency(nextFormData.title, nextFormData.description)
    if (hazard.isEmergency) {
      setAiHazardAlert(hazard)
      setFormData((curr) => ({ ...curr, priority: 'Critical' }))
    } else {
      setAiHazardAlert(null)
    }

    // Evaluate AI Semantic Similarity
    if (nextFormData.title.length > 5 || nextFormData.description.length > 10) {
      const matches = findAISimilarComplaints(nextFormData, allComplaints)
      setAiSimilarMatches(matches)
    } else {
      setAiSimilarMatches([])
    }
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
  }

  function handleAddCameraImage(file) {
    setSelectedFiles((prev) => [...prev, file])
    setImagePreviews((prev) => [...prev, URL.createObjectURL(file)])
  }

  function handleLocationPick(lat, lng) {
    setFormData((current) => ({
      ...current,
      latitude: String(lat),
      longitude: String(lng)
    }))
    setDismissDuplicates(false)
  }

  function handleCurrentLocation() {
    if (!baseLocationSupported) {
      setError('Geolocation is not supported in this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude)
        }))
        setDismissDuplicates(false)
      },
      () => setError('Unable to get current location')
    )
  }

  // Check for duplicate issues nearby when latitude, longitude, and category change
  useEffect(() => {
    if (!formData.latitude || !formData.longitude || !formData.category) {
      setDuplicates([])
      return
    }

    const timer = setTimeout(async () => {
      setCheckingDuplicates(true)
      try {
        const found = await checkDuplicateComplaints({
          latitude: formData.latitude,
          longitude: formData.longitude,
          category: formData.category,
          maxDistanceKm: 0.5
        })
        setDuplicates(found)
      } catch (err) {
        console.error('Failed to check duplicates:', err)
      } finally {
        setCheckingDuplicates(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [formData.latitude, formData.longitude, formData.category])

  function validate() {
    const nextErrors = {}

    if (!formData.title.trim()) nextErrors.title = 'Title is required'
    if (!formData.description.trim()) nextErrors.description = 'Description is required'
    if (!formData.category.trim()) nextErrors.category = 'Category is required'
    if (formData.latitude && Number.isNaN(Number(formData.latitude))) nextErrors.latitude = 'Latitude must be a number'
    if (formData.longitude && Number.isNaN(Number(formData.longitude))) nextErrors.longitude = 'Longitude must be a number'

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setError('')

    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const payload = buildComplaintFormData(formData, selectedFiles)
      await createComplaint(payload)
      onSaved?.()
      navigate('/complaints')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDuplicateUpvote(updatedComplaint) {
    setDuplicates((prev) =>
      prev.map((item) => (item._id === updatedComplaint._id ? { ...item, ...updatedComplaint } : item))
    )
  }

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-glow backdrop-blur-xl sm:p-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          📝 {t('report_issue_title')}
        </div>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t('report_issue_title')}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {t('report_issue_subtitle')}
        </p>
      </div>

      {/* AI Emergency Hazard Escalation Banner */}
      {aiHazardAlert ? (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-950/60 p-5 backdrop-blur-md shadow-lg shadow-rose-900/30 animate-pulse">
          <div className="flex items-center gap-3 text-rose-300">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-rose-200">
                AI EMERGENCY HAZARD DETECTED: {aiHazardAlert.hazardReason}
              </h3>
              <p className="text-xs text-rose-300/90 mt-0.5">
                Trigger keyword: <strong className="underline">"{aiHazardAlert.triggerWord}"</strong>. This issue has been automatically upgraded to <strong className="text-white">CRITICAL EMERGENCY</strong> priority.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rose-500/20 pt-2 text-xs text-rose-200">
            <span>Direct Dispatch: <strong>{aiHazardAlert.recommendedDepartment}</strong></span>
            <span className="rounded-full bg-rose-500/20 px-3 py-1 font-bold text-rose-200 border border-rose-500/40">
              📞 Emergency Helpline: {aiHazardAlert.helpline}
            </span>
          </div>
        </div>
      ) : null}

      {/* AI Semantic NLP Duplicate Similarity Banner */}
      {aiSimilarMatches.length > 0 && !dismissDuplicates ? (
        <div className="rounded-2xl border border-teal-400/40 bg-gradient-to-r from-teal-950/50 to-slate-900/90 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-300">
              <span className="text-xl">🤖</span>
              <h3 className="font-bold text-sm sm:text-base">
                AI Semantic Match Found ({aiSimilarMatches[0].similarityPercentage}% Similarity)
              </h3>
            </div>
            <span className="rounded-full bg-teal-400/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-200">
              NLP Match Engine
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
            Our AI NLP engine detected that this issue description closely matches existing community ticket(s). Consider upvoting to expedite resolution:
          </p>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {aiSimilarMatches.map(({ complaint: sim, similarityPercentage, commonKeywords }) => (
              <div key={sim._id} className="rounded-xl border border-teal-400/20 bg-slate-950/80 p-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                      🎯 {similarityPercentage}% Match
                    </span>
                    <h4 className="mt-1 font-semibold text-white">{sim.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sim.description}</p>
                    {commonKeywords?.length > 0 ? (
                      <p className="text-[10px] text-teal-400/80 mt-1">Matched terms: {commonKeywords.slice(0, 3).join(', ')}</p>
                    ) : null}
                  </div>
                  <UpvoteButton complaint={sim} onUpvoteChange={handleDuplicateUpvote} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
                  <span className="text-slate-400">Status: <span className="text-cyan-300">{sim.status}</span></span>
                  <Link to={`/complaints/${sim._id}`} className="text-teal-300 hover:underline font-medium">
                    Inspect Ticket →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Real-time GPS Duplicate Detection Alert Banner */}
      {!dismissDuplicates && duplicates.length > 0 ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/40 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <span className="text-xl">⚠️</span>
              <h3 className="font-bold text-sm sm:text-base">
                Nearby Proximity Match Detected ({duplicates.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setDismissDuplicates(true)}
              className="text-xs text-amber-200/80 hover:text-amber-100 underline"
            >
              Dismiss & Continue Reporting ✕
            </button>
          </div>
          <p className="mt-2 text-xs text-amber-200/90 leading-relaxed">
            To prevent duplicate tickets and help municipal teams prioritize faster, consider upvoting the existing active report(s) below instead of creating a new ticket:
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {duplicates.slice(0, 4).map((dup) => (
              <div key={dup._id} className="rounded-xl border border-amber-400/20 bg-slate-950/70 p-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-bold text-[10px] text-amber-300">
                      {dup.distanceMeters ? `~${dup.distanceMeters}m away` : 'Nearby'}
                    </span>
                    <h4 className="mt-1 font-semibold text-white">{dup.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{dup.address || dup.description}</p>
                  </div>
                  <UpvoteButton complaint={dup} onUpvoteChange={handleDuplicateUpvote} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
                  <span className="text-slate-400">Status: <span className="text-cyan-300">{dup.status}</span></span>
                  <Link to={`/complaints/${dup._id}`} className="text-cyan-300 hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {checkingDuplicates ? (
        <p className="text-xs text-cyan-300 animate-pulse">Checking for duplicate reports nearby...</p>
      ) : null}

      <div className="mt-4">
        <ComplaintForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Submit Civic Issue"
          loading={loading}
          errors={errors}
          onImagesChange={handleImageChange}
          onAddCameraImage={handleAddCameraImage}
          imagePreviews={imagePreviews}
          onGetCurrentLocation={handleCurrentLocation}
          onLocationPick={handleLocationPick}
          canEditStatus={canEditStatus}
          showRemarks={false}
        />
        {error ? <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p> : null}
      </div>
    </section>
  )
}