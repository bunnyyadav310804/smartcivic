export function buildComplaintFormData(formData, imageFiles = [], resolutionImageFiles = []) {
  const payload = new FormData()

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      payload.append(key, value)
    }
  })

  imageFiles.forEach((file) => {
    payload.append('images', file)
  })

  resolutionImageFiles.forEach((file) => {
    payload.append('resolutionImages', file)
  })

  return payload
}