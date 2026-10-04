import { useTranslation } from '../context/LanguageContext.jsx'

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'te', label: 'తెలుగు', short: 'తె' },
    { code: 'hi', label: 'हिन्दी', short: 'हि' }
  ]

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/80 p-1 backdrop-blur-md shadow-sm">
      <span className="pl-2 pr-1 text-xs text-slate-400">🌐</span>
      <div className="flex items-center gap-0.5">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
              language === lang.code
                ? 'bg-cyan-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title={lang.label}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
