import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { processCivicAIMessage } from '../services/aiCopilotService.js'
import { useTranslation } from '../context/LanguageContext.jsx'

export function CivicAICopilot() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    {
      id: 'm1',
      sender: 'ai',
      text: t('copilot_welcome')
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  async function handleSend(textToSend) {
    const query = textToSend || inputText
    if (!query.trim()) return

    const userMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const response = await processCivicAIMessage(query)
      const aiMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        action: response.action
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: 'I encountered an issue processing your request. Please try again.'
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function handleActionClick(action) {
    if (action.route) {
      setIsOpen(false)
      navigate(action.route)
    }
  }

  const quickPrompts = [
    '🚧 Pothole Repair Time',
    '💧 Report Water Leak',
    '🚨 Emergency Helplines',
    '✍️ Draft a Complaint'
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Launcher Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 text-slate-950 font-extrabold shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="text-xl animate-spin-slow">🤖</span>
          <span className="text-xs tracking-wide">SmartCity AI Copilot</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      ) : null}

      {/* Interactive Chat Window */}
      {isOpen ? (
        <div className="relative flex h-[520px] w-[350px] sm:w-[400px] flex-col overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-slate-950/95 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-950/80 to-slate-900 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 text-base font-bold">
                🤖
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">SmartCity AI Copilot</h3>
                <p className="text-[10px] text-cyan-300 flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online Municipal Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs text-white hover:bg-white/20 transition"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-white/5 bg-slate-900/60 p-2 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.sender === 'user'
                      ? 'bg-cyan-400 text-slate-950 font-medium'
                      : 'border border-white/10 bg-slate-900 text-slate-200 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line text-[11px] leading-relaxed">{msg.text}</p>

                  {msg.action ? (
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action)}
                      className="mt-2 block w-full rounded-xl bg-cyan-400 px-3 py-1.5 text-center text-[10px] font-bold text-slate-950 hover:bg-cyan-300 transition"
                    >
                      {msg.action.label} →
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-medium animate-pulse">
                <span>🤖 AI is analyzing municipal knowledge...</span>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="border-t border-white/10 bg-slate-900/90 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about potholes, water leaks, SLAs..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950 disabled:opacity-40 hover:bg-cyan-300 transition"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
