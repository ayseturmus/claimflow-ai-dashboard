import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/i18n/locales/en.json'
import tr from '@/i18n/locales/tr.json'

export const SUPPORTED_LOCALES = ['en', 'tr'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function detectLocale(): SupportedLocale {
  try {
    const saved = localStorage.getItem('claimflow_locale')
    if (saved === 'tr' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.slice(0, 2).toLowerCase()
    if (nav === 'tr') return 'tr'
  }
  return 'en'
}

function syncHtmlLang(lng: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'tr' ? 'tr' : 'en'
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: detectLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

syncHtmlLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('claimflow_locale', lng)
  } catch {
    /* ignore */
  }
  syncHtmlLang(lng)
})

export default i18n
