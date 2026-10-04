import mongoose from 'mongoose'
import Complaint from '../models/Complaint.js'

function notFoundError(message = 'Complaint not found') {
  const error = new Error(message)
  error.statusCode = 404
  return error
}

function forbiddenError(message = 'Not authorized for this complaint') {
  const error = new Error(message)
  error.statusCode = 403
  return error
}

function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const DEPARTMENT_TEAM_MAP = {
  'Potholes / Road Damage': {
    department: 'Roads & Transport Department',
    members: [
      { name: 'Ravi Kumar', phone: '+91 98765 43210', role: 'Road Engineer' },
      { name: 'Anita Verma', phone: '+91 98765 43211', role: 'Maintenance Supervisor' }
    ]
  },
  'Garbage & Sanitation': {
    department: 'Sanitation Department',
    members: [
      { name: 'Suresh Patil', phone: '+91 98765 43212', role: 'Sanitation Officer' },
      { name: 'Meena Iyer', phone: '+91 98765 43213', role: 'Waste Crew Lead' }
    ]
  },
  'Drainage Blockage': {
    department: 'Storm Water Management',
    members: [
      { name: 'Dinesh Rao', phone: '+91 98765 43214', role: 'Drainage Engineer' },
      { name: 'Kavya Nair', phone: '+91 98765 43215', role: 'Field Technician' }
    ]
  },
  'Water Leakage': {
    department: 'Water Supply Department',
    members: [
      { name: 'Harish Yadav', phone: '+91 98765 43216', role: 'Water Utility Supervisor' },
      { name: 'Priya Singh', phone: '+91 98765 43217', role: 'Pipeline Response Team' }
    ]
  },
  'Damaged Streetlights': {
    department: 'Electrical Maintenance Division',
    members: [
      { name: 'Vikram Shah', phone: '+91 98765 43218', role: 'Lighting Technician' },
      { name: 'Asha Reddy', phone: '+91 98765 43219', role: 'Grid Maintenance Lead' }
    ]
  },
  'Electricity & Hazards': {
    department: 'Power & Safety Unit',
    members: [
      { name: 'Nitin Joshi', phone: '+91 98765 43220', role: 'Power Safety Officer' },
      { name: 'Swathi Rao', phone: '+91 98765 43221', role: 'Hazard Response Team' }
    ]
  },
  Roads: {
    department: 'Roads & Transport Department',
    members: [
      { name: 'Ravi Kumar', phone: '+91 98765 43210', role: 'Road Engineer' },
      { name: 'Anita Verma', phone: '+91 98765 43211', role: 'Maintenance Supervisor' }
    ]
  },
  Sanitation: {
    department: 'Sanitation Department',
    members: [
      { name: 'Suresh Patil', phone: '+91 98765 43212', role: 'Sanitation Officer' },
      { name: 'Meena Iyer', phone: '+91 98765 43213', role: 'Waste Crew Lead' }
    ]
  },
  Water: {
    department: 'Water Supply Department',
    members: [
      { name: 'Harish Yadav', phone: '+91 98765 43216', role: 'Water Utility Supervisor' },
      { name: 'Priya Singh', phone: '+91 98765 43217', role: 'Pipeline Response Team' }
    ]
  },
  Electricity: {
    department: 'Electrical Maintenance Division',
    members: [
      { name: 'Vikram Shah', phone: '+91 98765 43218', role: 'Lighting Technician' },
      { name: 'Asha Reddy', phone: '+91 98765 43219', role: 'Grid Maintenance Lead' }
    ]
  },
  Other: {
    department: 'City Operations Cell',
    members: [
      { name: 'Arun Babu', phone: '+91 98765 43222', role: 'Operations Coordinator' },
      { name: 'Sonia Das', phone: '+91 98765 43223', role: 'Field Support Lead' }
    ]
  }
}

export function resolveDepartmentAssignment(category) {
  const departmentKey = category?.trim() || 'Other'
  const match = DEPARTMENT_TEAM_MAP[departmentKey] || DEPARTMENT_TEAM_MAP.Other

  return {
    department: match.department,
    departmentMembers: match.members.map((member) => ({ ...member }))
  }
}

function normalizeComplaintInput(payload) {
  return {
    title: payload.title?.trim(),
    description: payload.description?.trim(),
    category: payload.category?.trim(),
    latitude: payload.latitude === '' || payload.latitude === undefined ? undefined : Number(payload.latitude),
    longitude: payload.longitude === '' || payload.longitude === undefined ? undefined : Number(payload.longitude),
    address: payload.address?.trim(),
    status: payload.status?.trim(),
    priority: payload.priority?.trim(),
    department: payload.department?.trim(),
    departmentMembers: Array.isArray(payload.departmentMembers) ? payload.departmentMembers.map((member) => ({
      name: member?.name?.trim() || '',
      phone: member?.phone?.trim() || '',
      role: member?.role?.trim() || ''
    })) : undefined,
    remarks: payload.remarks?.trim(),
    isAnonymous: payload.isAnonymous === true || payload.isAnonymous === 'true'
  }
}

function normalizeImages(images = []) {
  if (!Array.isArray(images)) {
    return []
  }

  return images.filter(Boolean)
}

function mergeComplaintFields(complaint, complaintData) {
  const numericFields = ['latitude', 'longitude']

  Object.entries(complaintData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    if (numericFields.includes(key)) {
      if (!Number.isNaN(value)) {
        complaint[key] = value
      }
      return
    }

    complaint[key] = value
  })
}

function canManageStatus(user) {
  return user?.role === 'Admin'
}

function buildComplaintFilter({ search, status, category, department, createdBy }) {
  const filter = {}

  if (search?.trim()) {
    filter.title = { $regex: search.trim(), $options: 'i' }
  }

  if (status?.trim()) {
    filter.status = status.trim()
  }

  if (category?.trim()) {
    filter.category = category.trim()
  }

  if (department?.trim()) {
    filter.department = department.trim()
  }

  if (createdBy?.trim()) {
    filter.createdBy = createdBy.trim()
  }

  return filter
}

export function sanitizeComplaintForUser(complaintDoc, currentUserId, currentUserRole) {
  if (!complaintDoc) return complaintDoc
  const complaint = complaintDoc.toObject ? complaintDoc.toObject({ virtuals: true }) : { ...complaintDoc }

  const isOwner = currentUserId && complaint.createdBy && (
    (complaint.createdBy._id && complaint.createdBy._id.toString() === currentUserId.toString()) ||
    complaint.createdBy.toString() === currentUserId.toString()
  )

  const isAdmin = currentUserRole === 'Admin'

  if (complaint.isAnonymous && !isAdmin && !isOwner) {
    if (complaint.createdBy && typeof complaint.createdBy === 'object') {
      complaint.createdBy = {
        _id: complaint.createdBy._id,
        name: 'Anonymous Citizen',
        role: 'Citizen'
      }
    }
  }

  return complaint
}

export async function createComplaint(userId, payload) {
  const complaintData = normalizeComplaintInput(payload)
  const assignedDepartment = resolveDepartmentAssignment(complaintData.category)

  const initialTimeline = [
    {
      status: 'Submitted',
      remarks: 'Complaint registered and queued for verification',
      action: 'Report Submitted',
      timestamp: new Date(),
      updatedBy: userId
    }
  ]

  const complaint = await Complaint.create({
    title: complaintData.title,
    description: complaintData.description,
    category: complaintData.category,
    latitude: complaintData.latitude,
    longitude: complaintData.longitude,
    address: complaintData.address,
    priority: complaintData.priority || 'Medium',
    department: complaintData.department || assignedDepartment.department,
    departmentMembers: Array.isArray(complaintData.departmentMembers) && complaintData.departmentMembers.length > 0
      ? complaintData.departmentMembers
      : assignedDepartment.departmentMembers,
    isAnonymous: complaintData.isAnonymous,
    images: normalizeImages(payload.images),
    resolutionImages: [],
    timeline: initialTimeline,
    createdBy: userId
  })

  return complaint.populate('createdBy', 'name email phone role')
}

export async function findNearbyDuplicates({ latitude, longitude, category, maxDistanceKm = 0.5 }) {
  if (latitude === undefined || longitude === undefined || Number.isNaN(Number(latitude)) || Number.isNaN(Number(longitude))) {
    return []
  }

  const latNum = Number(latitude)
  const lonNum = Number(longitude)

  const query = {
    status: { $in: ['Submitted', 'Assigned', 'In Progress'] }
  }

  if (category?.trim()) {
    query.category = category.trim()
  }

  const activeComplaints = await Complaint.find(query).populate('createdBy', 'name email phone role')

  const duplicates = []

  for (const complaint of activeComplaints) {
    if (complaint.latitude != null && complaint.longitude != null) {
      const distanceKm = calculateHaversineDistanceKm(latNum, lonNum, complaint.latitude, complaint.longitude)
      if (distanceKm <= maxDistanceKm) {
        const obj = complaint.toObject({ virtuals: true })
        duplicates.push({
          ...obj,
          distanceMeters: Math.round(distanceKm * 1000)
        })
      }
    }
  }

  return duplicates.sort((a, b) => a.distanceMeters - b.distanceMeters)
}

export async function getComplaints(query = {}, currentUserId = null, currentUserRole = null) {
  const complaints = await Complaint.find(buildComplaintFilter(query))
    .populate('createdBy', 'name email phone role')
    .sort({ createdAt: -1 })

  return complaints.map((c) => sanitizeComplaintForUser(c, currentUserId, currentUserRole))
}

export async function getComplaintStatistics() {
  const baseStats = {
    total: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  }

  const aggregation = await Complaint.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        submitted: { $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] } },
        assigned: { $sum: { $cond: [{ $eq: ['$status', 'Assigned'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } }
      }
    }
  ])

  return aggregation[0] ? { ...baseStats, ...aggregation[0] } : baseStats
}

export async function getComplaintById(complaintId, currentUserId = null, currentUserRole = null) {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw notFoundError()
  }

  const complaint = await Complaint.findById(complaintId)
    .populate('createdBy', 'name email phone role')
    .populate('timeline.updatedBy', 'name role')
    .populate('feedback.submittedBy', 'name')

  if (!complaint) {
    throw notFoundError()
  }

  return sanitizeComplaintForUser(complaint, currentUserId, currentUserRole)
}

export async function updateComplaint(complaintId, userId, userRole, payload) {
  const complaint = await Complaint.findById(complaintId)

  if (!complaint) {
    throw notFoundError()
  }

  if (userRole !== 'Admin' && complaint.createdBy.toString() !== userId.toString()) {
    throw forbiddenError()
  }

  const complaintData = normalizeComplaintInput(payload)

  if (userRole !== 'Admin' && (payload.status !== undefined || payload.remarks !== undefined)) {
    throw forbiddenError('Only admins can update complaint status and remarks')
  }

  mergeComplaintFields(complaint, complaintData)

  if (payload.images !== undefined && Array.isArray(payload.images) && payload.images.length > 0) {
    complaint.images = normalizeImages([...(complaint.images || []), ...payload.images])
  }

  if (payload.resolutionImages !== undefined && Array.isArray(payload.resolutionImages) && payload.resolutionImages.length > 0) {
    complaint.resolutionImages = normalizeImages([...(complaint.resolutionImages || []), ...payload.resolutionImages])
  }

  if (payload.isAnonymous !== undefined) {
    complaint.isAnonymous = complaintData.isAnonymous
  }

  if (userRole === 'Admin') {
    const statusChanged = complaintData.status && complaintData.status !== complaint.status
    if (complaintData.status) {
      complaint.status = complaintData.status
    }

    if (typeof complaintData.remarks === 'string') {
      complaint.remarks = complaintData.remarks
    }

    if (statusChanged || complaintData.remarks) {
      complaint.timeline.push({
        status: complaint.status,
        remarks: complaintData.remarks || `Status updated to ${complaint.status}`,
        action: `Status changed to ${complaint.status}`,
        timestamp: new Date(),
        updatedBy: userId
      })
    }
  }

  await complaint.save()

  return complaint.populate('createdBy', 'name email phone role')
}

export async function updateComplaintStatus(complaintId, userId, payload, userRole, newResolutionImages = []) {
  if (!canManageStatus({ role: userRole })) {
    const error = new Error('Only admins can update complaint status and remarks')
    error.statusCode = 403
    throw error
  }

  const complaint = await Complaint.findById(complaintId)

  if (!complaint) {
    throw notFoundError()
  }

  const { status, remarks } = normalizeComplaintInput(payload)
  const prevStatus = complaint.status

  if (status) {
    complaint.status = status
  }

  if (typeof remarks === 'string') {
    complaint.remarks = remarks
  }

  if (Array.isArray(newResolutionImages) && newResolutionImages.length > 0) {
    complaint.resolutionImages = normalizeImages([...(complaint.resolutionImages || []), ...newResolutionImages])
  }

  complaint.timeline.push({
    status: complaint.status,
    remarks: remarks || `Status transitioned from ${prevStatus} to ${complaint.status}`,
    action: `Status changed to ${complaint.status}`,
    timestamp: new Date(),
    updatedBy: userId
  })

  await complaint.save()

  return complaint.populate('createdBy', 'name email phone role')
}

export async function submitComplaintFeedback(complaintId, userId, { rating, comment }) {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw notFoundError()
  }

  const complaint = await Complaint.findById(complaintId)

  if (!complaint) {
    throw notFoundError()
  }

  if (complaint.status !== 'Resolved') {
    const error = new Error('Feedback can only be submitted for resolved complaints')
    error.statusCode = 400
    throw error
  }

  const numRating = Number(rating)
  if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
    const error = new Error('Rating must be an integer between 1 and 5')
    error.statusCode = 400
    throw error
  }

  complaint.feedback = {
    rating: numRating,
    comment: comment?.trim() || '',
    submittedAt: new Date(),
    submittedBy: userId
  }

  complaint.timeline.push({
    status: 'Resolved',
    remarks: `Citizen rated resolution: ${numRating}/5 ★${comment ? ` - "${comment.trim()}"` : ''}`,
    action: 'Citizen Feedback Received',
    timestamp: new Date(),
    updatedBy: userId
  })

  await complaint.save()

  return complaint.populate('createdBy', 'name email phone role')
}

export async function deleteComplaint(complaintId, userId, userRole) {
  const complaint = await Complaint.findById(complaintId)

  if (!complaint) {
    throw notFoundError()
  }

  if (userRole !== 'Admin' && complaint.createdBy.toString() !== userId.toString()) {
    throw forbiddenError()
  }

  await complaint.deleteOne()

  return { message: 'Complaint deleted successfully' }
}

export async function addUpvote(complaintId, userId) {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw notFoundError()
  }

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { $addToSet: { upvotes: userId } },
    { new: true }
  ).populate('createdBy', 'name email phone role')

  if (!complaint) {
    throw notFoundError()
  }

  return complaint
}

export async function removeUpvote(complaintId, userId) {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw notFoundError()
  }

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { $pull: { upvotes: userId } },
    { new: true }
  ).populate('createdBy', 'name email phone role')

  if (!complaint) {
    throw notFoundError()
  }

  return complaint
}