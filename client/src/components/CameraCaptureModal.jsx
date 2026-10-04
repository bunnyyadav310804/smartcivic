import { useEffect, useRef, useState } from 'react'

export function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      setCapturedImage(null)
      setError('')
      return
    }

    startCamera(facingMode)

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  async function startCamera(mode) {
    stopCamera()
    setError('')
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Unable to access camera. Please ensure camera permissions are allowed.')
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  function handleCapture() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const imageUrl = URL.createObjectURL(blob)
        const file = new File([blob], `live-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setCapturedImage({ file, preview: imageUrl })
      },
      'image/jpeg',
      0.9
    )
  }

  function handleRetake() {
    if (capturedImage?.preview) {
      URL.revokeObjectURL(capturedImage.preview)
    }
    setCapturedImage(null)
  }

  function handleConfirm() {
    if (capturedImage?.file) {
      onCapture(capturedImage.file)
      handleClose()
    }
  }

  function handleClose() {
    stopCamera()
    if (capturedImage?.preview) {
      URL.revokeObjectURL(capturedImage.preview)
    }
    setCapturedImage(null)
    onClose()
  }

  function toggleCamera() {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">📸 Live Camera Capture</h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="space-y-4 py-8 text-center">
            <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
              {error}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
              {capturedImage ? (
                <img
                  src={capturedImage.preview}
                  alt="Captured frame"
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center justify-center gap-3">
              {capturedImage ? (
                <>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    🔄 Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    ✓ Use This Photo
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleCamera}
                    title="Flip camera"
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/20"
                  >
                    🔄 Flip Camera
                  </button>
                  <button
                    type="button"
                    onClick={handleCapture}
                    className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 active:scale-95"
                  >
                    <span className="h-3 w-3 rounded-full bg-slate-950" />
                    Capture Photo
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
