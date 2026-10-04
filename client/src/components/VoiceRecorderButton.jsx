import { useState } from 'react'
import { useTranslation } from '../context/LanguageContext.jsx'

export function VoiceRecorderButton({ onTranscript, disabled }) {
  const { t, speechLocale } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  function startListening() {
    setErrorMsg('')
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setErrorMsg('Voice recognition not supported on this browser.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = speechLocale || 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (transcript && onTranscript) {
          onTranscript(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        setErrorMsg(`Speech error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      console.error(err)
      setIsListening(false)
      setErrorMsg('Could not access microphone.')
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={startListening}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          isListening
            ? 'animate-pulse bg-rose-500 text-white shadow-lg shadow-rose-500/40'
            : 'border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20'
        }`}
        title={t('voice_dictate')}
      >
        <span>{isListening ? t('listening') : t('voice_dictate')}</span>
      </button>
      {errorMsg ? <span className="text-[11px] text-rose-300">{errorMsg}</span> : null}
    </div>
  )
}

