import {
  addUpvote,
  createComplaint,
  deleteComplaint,
  findNearbyDuplicates,
  getComplaintById,
  getComplaintStatistics,
  getComplaints,
  removeUpvote,
  submitComplaintFeedback,
  updateComplaint,
  updateComplaintStatus
} from '../services/complaintService.js'

function sendError(response, error) {
  return response.status(error.statusCode || 500).json({ message: error.message || 'Complaint request failed' })
}

function extractUploadedImages(files) {
  if (!files) return { images: [], resolutionImages: [] }

  if (Array.isArray(files)) {
    return {
      images: files.map((file) => `/uploads/complaints/${file.filename}`),
      resolutionImages: []
    }
  }

  const images = (files.images || []).map((file) => `/uploads/complaints/${file.filename}`)
  const resolutionImages = (files.resolutionImages || []).map((file) => `/uploads/complaints/${file.filename}`)

  return { images, resolutionImages }
}

export async function create(request, response) {
  const { title, description, category, priority, latitude, longitude, address, isAnonymous } = request.body
  const { images } = extractUploadedImages(request.files)

  if (!title?.trim() || !description?.trim() || !category?.trim()) {
    return response.status(400).json({ message: 'Title, description, and category are required' })
  }

  try {
    const complaint = await createComplaint(request.user._id, {
      title,
      description,
      category,
      priority,
      latitude,
      longitude,
      address,
      isAnonymous,
      images
    })
    return response.status(201).json({ complaint })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function checkDuplicates(request, response) {
  const { latitude, longitude, category, maxDistanceKm } = request.body || request.query

  try {
    const duplicates = await findNearbyDuplicates({
      latitude,
      longitude,
      category,
      maxDistanceKm: maxDistanceKm ? Number(maxDistanceKm) : 0.5
    })
    return response.json({ duplicates })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function list(request, response) {
  try {
    const complaints = await getComplaints(request.query, request.user?._id, request.user?.role)
    return response.json({ complaints })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function statistics(_request, response) {
  try {
    const statistics = await getComplaintStatistics()
    return response.json({ statistics })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function details(request, response) {
  try {
    const complaint = await getComplaintById(request.params.id, request.user?._id, request.user?.role)
    return response.json({ complaint })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function update(request, response) {
  try {
    const { images, resolutionImages } = extractUploadedImages(request.files)
    const complaint = await updateComplaint(request.params.id, request.user._id, request.user.role, {
      ...request.body,
      images: images.length > 0 ? images : undefined,
      resolutionImages: resolutionImages.length > 0 ? resolutionImages : undefined
    })
    return response.json({ complaint })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function updateStatus(request, response) {
  try {
    const { resolutionImages } = extractUploadedImages(request.files)
    const complaint = await updateComplaintStatus(
      request.params.id,
      request.user._id,
      request.body,
      request.user.role,
      resolutionImages
    )
    return response.json({ complaint })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function addFeedback(request, response) {
  const { rating, comment } = request.body

  if (!rating) {
    return response.status(400).json({ message: 'Rating is required' })
  }

  try {
    const complaint = await submitComplaintFeedback(request.params.id, request.user._id, { rating, comment })
    return response.json({ complaint, message: 'Feedback submitted successfully' })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function remove(request, response) {
  try {
    const result = await deleteComplaint(request.params.id, request.user._id, request.user.role)
    return response.json(result)
  } catch (error) {
    return sendError(response, error)
  }
}

export async function upvote(request, response) {
  try {
    const complaint = await addUpvote(request.params.id, request.user._id)
    return response.json({
      complaint,
      upvoteCount: complaint.upvotes?.length || 0,
      isUpvoted: true
    })
  } catch (error) {
    return sendError(response, error)
  }
}

export async function removeUpvoteHandler(request, response) {
  try {
    const complaint = await removeUpvote(request.params.id, request.user._id)
    return response.json({
      complaint,
      upvoteCount: complaint.upvotes?.length || 0,
      isUpvoted: false
    })
  } catch (error) {
    return sendError(response, error)
  }
}