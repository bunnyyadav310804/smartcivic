import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ComplaintForm } from '../components/ComplaintForm.jsx'
import { fetchComplaint, updateComplaint, updateComplaintStatus } from '../services/complaints.js'
import { buildComplaintFormData } from '../services/complaintFormData.js'
import { useAuth } from '../context/AuthContext.jsx'

export function ComplaintEditPage({ onSaved }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
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
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [resolutionFiles, setResolutionFiles] = useState([])
  const [resolutionPreviews, setResolutionPreviews] = useState([])
  const [existingResolutionImages, setExistingResolutionImages] = useState([])

  useEffect(() => {
    let mounted = true

    async function loadComplaint() {
      try {
        const data = await fetchComplaint(id)
        if (mounted) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            latitude: data.latitude ?? '',
            longitude: data.longitude ?? '',
            address: data.address || '',
            status: data.status || 'Submitted',
            priority: data.priority || 'Medium',
            isAnonymous: Boolean(data.isAnonymous),
            remarks: data.remarks || ''
          })
          setExistingImages(data.images || [])
          setExistingResolutionImages(data.resolutionImages || [])
        }
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

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
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

  function handleResolutionImageChange(event) {
    const files = Array.from(event.target.files || [])
    setResolutionFiles((prev) => [...prev, ...files])
    setResolutionPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
  }

  function handleCurrentLocation() {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setFormData((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude)
        }))
      },
      () => setError('Unable to get current location')
    )
  }

  function handleLocationPick(lat, lng) {
    setFormData((current) => ({
      ...current,
      latitude: String(lat),
      longitude: String(lng)
    }))
  }

  function validate() {
    const nextErrors = {}
    if (!formData.title.trim()) nextErrors.title = 'Title is required'
    if (!formData.description.trim()) nextErrors.description = 'Description is required'
    if (!formData.category.trim()) nextErrors.category = 'Category is required'
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setError('')

    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (user?.role === 'Admin') {
        const payload = buildComplaintFormData(
          {
            status: formData.status,
            remarks: formData.remarks
          },
          [],
          resolutionFiles
        )
        await updateComplaintStatus(id, payload)
      } else {
        const editableData = (({ status, remarks, ...rest }) => rest)(formData)
        const payload = buildComplaintFormData(editableData, selectedFiles)
        await updateComplaint(id, payload)
      }

      onSaved?.()
      navigate('/complaints')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white">Loading complaint...</section>
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-glow backdrop-blur-xl sm:p-8">
      <h2 className="text-2xl font-semibold">Edit Issue Report</h2>
      <div className="mt-6">
        {existingImages.length > 0 ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Existing Evidence Images:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((imageUrl) => (
                <img key={imageUrl} src={imageUrl} alt="Existing complaint" className="h-28 w-full rounded-2xl object-cover border border-white/10" />
              ))}
            </div>
          </div>
        ) : null}

        {existingResolutionImages.length > 0 ? (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">Existing Resolution Proof Images:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingResolutionImages.map((imageUrl) => (
                <img key={imageUrl} src={imageUrl} alt="Existing resolution proof" className="h-28 w-full rounded-2xl object-cover border border-emerald-400/30" />
              ))}
            </div>
          </div>
        ) : null}

        <ComplaintForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Update Issue Report"
          loading={saving}
          errors={errors}
          onImagesChange={handleImageChange}
          onAddCameraImage={handleAddCameraImage}
          imagePreviews={imagePreviews}
          onGetCurrentLocation={handleCurrentLocation}
          onLocationPick={handleLocationPick}
          canEditStatus={user?.role === 'Admin'}
          showRemarks={user?.role === 'Admin'}
          resolutionImagePreviews={resolutionPreviews}
          onResolutionImagesChange={handleResolutionImageChange}
        />
        {error ? <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200">{error}</p> : null}
      </div>
    </section>
  )
}