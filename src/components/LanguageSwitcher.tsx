import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SupportedLocale } from '@/i18n/config'
import { SUPPORTED_LOCALES } from '@/i18n/config'

type LanguageSwitcherProps = {
  /** İki bölmeli yuvarlak toggle; dashboard üst çubuğu için. */
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()

  function setLocale(lng: SupportedLocale) {
    void i18n.changeLanguage(lng)
  }

  const active = i18n.language.startsWith('tr') ? 'tr' : 'en'

  if (variant === 'compact') {
    return (
      <div
        className="inline-flex rounded-full border border-border/70 bg-muted/70 p-0.5 shadow-inner"
        role="group"
        aria-label={t('language.label')}
      >
        {SUPPORTED_LOCALES.map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => setLocale(lng)}
            aria-pressed={active === lng}
            title={lng === 'en' ? t('language.en') : t('language.tr')}
            className={cn(
              'min-h-9 min-w-[3rem] touch-manipulation rounded-full px-3 text-xs font-semibold uppercase tracking-wide transition-colors duration-150',
              active === lng
                ? 'bg-background text-foreground shadow-sm ring-1 ring-black/[0.06]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {lng === 'en' ? t('language.enShort') : t('language.trShort')}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={t('language.label')}
    >
      <span className="text-xs font-medium text-muted-foreground">{t('language.label')}:</span>
      <div className="flex rounded-md border border-input bg-background p-0.5">
        {SUPPORTED_LOCALES.map((lng) => (
          <Button
            key={lng}
            type="button"
            variant={active === lng ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9 touch-manipulation px-3 text-xs"
            onClick={() => setLocale(lng)}
            aria-pressed={active === lng}
          >
            {lng === 'en' ? t('language.en') : t('language.tr')}
          </Button>
        ))}
      </div>
    </div>
  )
}
