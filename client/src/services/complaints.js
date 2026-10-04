import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart-civic-auth-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export async function fetchComplaints() {
  const { data } = await client.get('/complaints')
  return data.complaints
}

export async function fetchComplaintStats() {
  const { data } = await client.get('/complaints/dashboard/stats')
  return data.statistics
}

export async function fetchFilteredComplaints(params = {}) {
  const { data } = await client.get('/complaints', { params })
  return data.complaints
}

export async function fetchComplaint(id) {
  const { data } = await client.get(`/complaints/${id}`)
  return data.complaint
}

export async function createComplaint(payload) {
  const { data } = await client.post('/complaints', payload)
  return data.complaint
}

export async function updateComplaint(id, payload) {
  const { data } = await client.put(`/complaints/${id}`, payload)
  return data.complaint
}

export async function updateComplaintStatus(id, payload) {
  const { data } = await client.patch(`/complaints/${id}/status`, payload)
  return data.complaint
}

export async function checkDuplicateComplaints(params) {
  const { data } = await client.post('/complaints/check-duplicates', params)
  return data.duplicates || []
}

export async function submitComplaintFeedback(id, payload) {
  const { data } = await client.post(`/complaints/${id}/feedback`, payload)
  return data.complaint
}

export async function deleteComplaint(id) {
  const { data } = await client.delete(`/complaints/${id}`)
  return data
}

export async function upvoteComplaint(id) {
  const { data } = await client.post(`/complaints/${id}/upvote`)
  return data
}

export async function removeUpvoteComplaint(id) {
  const { data } = await client.delete(`/complaints/${id}/upvote`)
  return data
}