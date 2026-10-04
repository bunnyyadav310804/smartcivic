import { useMemo, useState } from 'react'
import { CameraCaptureModal } from './CameraCaptureModal.jsx'
import { ComplaintMapView } from './ComplaintMapView.jsx'
import { analyzeIssueImage } from '../services/aiVisionService.js'
import { VoiceRecorderButton } from './VoiceRecorderButton.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'

export function ComplaintForm({
  formData,
  onChange,
  onSubmit,
  submitLabel,
  loading,
  errors = {},
  imagePreviews = [],
  selectedFiles = [],
  onImagesChange,
  onAddCameraImage,
  onGetCurrentLocation,
  onLocationPick,
  canEditStatus = true,
  showLocation = true,
  showImages = true,
  showRemarks = true,
  resolutionImagePreviews = [],
  onResolutionImagesChange
}) {
  const { t } = useTranslation()

  const civicCategories = useMemo(() => [
    { value: 'Potholes / Road Damage', label: t('cat_potholes') },
    { value: 'Garbage & Sanitation', label: t('cat_garbage') },
    { value: 'Drainage Blockage', label: t('cat_drainage') },
    { value: 'Water Leakage', label: t('cat_water') },
    { value: 'Damaged Streetlights', label: t('cat_streetlights') },
    { value: 'Electricity & Hazards', label: t('cat_electricity') },
    { value: 'Other', label: t('cat_other') }
  ], [t])

  const priorities = useMemo(() => [
    { value: 'Low', label: t('prio_low') },
    { value: 'Medium', label: t('prio_medium') },
    { value: 'High', label: t('prio_high') },
    { value: 'Critical', label: t('prio_critical') }
  ], [t])

  const workflowStatuses = useMemo(() => [
    { value: 'Submitted', label: t('stat_submitted') },
    { value: 'Assigned', label: t('stat_assigned') },
    { value: 'In Progress', label: t('stat_in_progress') },
    { value: 'Resolved', label: t('stat_resolved') },
    { value: 'Rejected', label: t('stat_rejected') }
  ], [t])

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null)

  async function handleAIVisionScan() {
    const target = (selectedFiles && selectedFiles[0]) || (imagePreviews && imagePreviews[0])
    if (!target) return

    setIsAnalyzingAI(true)
    try {
      const result = await analyzeIssueImage(target)
      setAiAnalysisResult(result)

      // Auto-fill category & priority
      if (result.category) {
        onChange({ target: { name: 'category', value: result.category } })
      }
      if (result.priority) {
        onChange({ target: { name: 'priority', value: result.priority } })
      }
      if (result.suggestedTitle && !formData.title.trim()) {
        onChange({ target: { name: 'title', value: result.suggestedTitle } })
      }
      if (result.suggestedDescription && !formData.description.trim()) {
        onChange({ target: { name: 'description', value: result.suggestedDescription } })
      }
    } catch (err) {
      console.error('AI Vision error:', err)
    } finally {
      setIsAnalyzingAI(false)
    }
  }

  function handleVoiceTranscript(text) {
    const current = formData.description || ''
    const updated = current ? `${current} ${text}` : text
    onChange({ target: { name: 'description', value: updated } })
  }

  return (
    <>
      <form className="grid gap-5" onSubmit={onSubmit}>
        <Field
          label={t('title')}
          name="title"
          value={formData.title}
          onChange={onChange}
          error={errors.title}
          placeholder={t('title_placeholder')}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{t('description')}</span>
            <VoiceRecorderButton onTranscript={handleVoiceTranscript} />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="4"
            placeholder={t('description_placeholder')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
          {errors.description ? <span className="mt-1 block text-sm text-rose-300">{errors.description}</span> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">{t('category')}</span>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">{t('select_category')}</option>
              {civicCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category ? <span className="mt-2 block text-sm text-rose-300">{errors.category}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">{t('priority')}</span>
            <select
              name="priority"
              value={formData.priority}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              {priorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Anonymous Reporting Option */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={Boolean(formData.isAnonymous)}
              onChange={(e) => onChange({ target: { name: 'isAnonymous', value: e.target.checked } })}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400 focus:ring-cyan-400/20"
            />
            <div>
              <span className="text-sm font-semibold text-white">{t('anonymous_reporting')}</span>
              <p className="mt-0.5 text-xs text-slate-400">
                {t('anonymous_help')}
              </p>
            </div>
          </label>
        </div>

        {showLocation ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">{t('location_section')}</span>
              <div className="flex items-center gap-2">
                {onGetCurrentLocation ? (
                  <button
                    type="button"
                    onClick={onGetCurrentLocation}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
                  >
                    {t('use_gps')}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setShowMapPicker((prev) => !prev)}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  {showMapPicker ? t('hide_map') : t('pick_on_map')}
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label={t('latitude')} name="latitude" value={formData.latitude} onChange={onChange} error={errors.latitude} placeholder="e.g. 17.3850" />
              <Field label={t('longitude')} name="longitude" value={formData.longitude} onChange={onChange} error={errors.longitude} placeholder="e.g. 78.4867" />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">{t('address')}</span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  placeholder={t('address_placeholder')}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            {showMapPicker ? (
              <div className="mt-3">
                <ComplaintMapView
                  height="280px"
                  pickerMode={true}
                  selectedLocation={{ latitude: formData.latitude, longitude: formData.longitude }}
                  onLocationSelect={(lat, lng) => {
                    if (onLocationPick) {
                      onLocationPick(lat, lng)
                    } else {
                      onChange({ target: { name: 'latitude', value: lat } })
                      onChange({ target: { name: 'longitude', value: lng } })
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Image Uploads: Gallery or Live Camera */}
        {showImages ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{t('evidence_images')}</span>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-400/25"
              >
                {t('take_live_photo')}
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs text-slate-400">{t('upload_gallery')}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImagesChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-950"
              />
            </label>

            {imagePreviews.length > 0 ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">{t('selected_photos')} ({imagePreviews.length}):</p>
                  <button
                    type="button"
                    onClick={handleAIVisionScan}
                    disabled={isAnalyzingAI}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-3.5 py-1 text-xs font-bold text-teal-300 shadow-sm hover:from-teal-500/30 hover:to-cyan-500/30 disabled:opacity-60 transition"
                  >
                    <span>✨</span> {isAnalyzingAI ? t('ai_scanning') : t('ai_detect_btn')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
                    </div>
                  ))}
                </div>

                {aiAnalysisResult ? (
                  <div className="rounded-2xl border border-teal-400/30 bg-teal-950/40 p-3.5 text-xs text-teal-200 space-y-1.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300">🤖 AI Vision Detection Summary:</span>
                      <span className="rounded-full bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold text-teal-200">
                        {aiAnalysisResult.confidence}% {t('ai_match')}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Predicted Category: <strong className="text-white">{aiAnalysisResult.category}</strong> | Estimated Severity: <strong className="text-amber-300">{aiAnalysisResult.priority}</strong>
                    </p>
                    {aiAnalysisResult.detectedObjects ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {aiAnalysisResult.detectedObjects.map((obj, i) => (
                          <span key={i} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                            {obj}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Admin Resolution Proof Uploads */}
        {canEditStatus && (formData.status === 'Resolved' || formData.status === 'In Progress') && onResolutionImagesChange ? (
          <div className="space-y-3 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
            <span className="text-sm font-semibold text-emerald-300">✅ Resolution Verification Images (After Resolution Proof)</span>
            <p className="text-xs text-slate-400">Upload photos proving that the issue has been resolved for citizen transparency.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onResolutionImagesChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-950"
            />
            {resolutionImagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {resolutionImagePreviews.map((preview, idx) => (
                  <img key={idx} src={preview} alt={`Resolution preview ${idx + 1}`} className="h-24 w-full rounded-2xl object-cover border border-emerald-400/30" />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {showRemarks ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Admin Remarks / Notes</span>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={onChange}
              rows="3"
              placeholder="Official action notes, dispatch details, or resolution remarks..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>
        ) : null}

        {canEditStatus ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Workflow Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              {workflowStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <button
          className="rounded-2xl bg-cyan-400 px-4 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? t('saving_btn') : (submitLabel || t('submit_btn'))}
        </button>
      </form>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          onAddCameraImage?.(file)
        }}
      />
    </>
  )
}

function Field({ label, name, value, onChange, error, textarea = false, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows="4"
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      )}
      {error ? <span className="mt-2 block text-sm text-rose-300">{error}</span> : null}
    </label>
  )
}