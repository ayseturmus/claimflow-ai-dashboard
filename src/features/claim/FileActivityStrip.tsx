import { Milestone } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ClaimProcess } from '@/features/claim/schemas'
import { cn } from '@/lib/utils'

function translateActivity(t: ReturnType<typeof useTranslation>['t'], key: string) {
  const path = `fileProcess.activityEvents.${key}`
  const out = t(path)
  return out === path ? key : out
}

function tinyDate(isoLike: string, locale: string) {
  const d = new Date(isoLike)
  if (Number.isNaN(d.getTime())) return isoLike
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(d)
}

export function FileActivityStrip({ claim }: { claim: ClaimProcess }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('tr') ? 'tr-TR' : 'en-US'

  const sorted = useMemo(() => {
    const raw = [...(claim.fileActivityTimeline ?? [])]
    raw.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return raw
  }, [claim.fileActivityTimeline])

  const n = sorted.length
  if (!n) return null

  return (
    <section
      className={cn(
        'mt-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-card to-card',
        'px-4 py-4 shadow-sm ring-1 ring-primary/10 md:px-6 md:py-5',
      )}
      aria-label={t('fileProcess.activityStripAria')}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Milestone className="h-[18px] w-[18px]" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/90">
            {t('fileProcess.activityStripEyebrow')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tracking-tight text-foreground md:text-[15px]">
            {t('fileProcess.activityStripTitle')}
          </p>
        </div>
      </div>

      <div className="md:-mx-1 md:overflow-x-auto md:pb-1 md:[-webkit-overflow-scrolling:touch]">
        <ul className="relative m-0 flex list-none flex-col gap-0 p-0 md:min-w-min md:flex-row md:items-start md:justify-between md:px-2 lg:px-0">
          {sorted.map((row, i) => {
            const label = translateActivity(t, row.eventKey)
            const isLast = i === n - 1
            return (
              <li
                key={`${row.date}-${row.eventKey}-${i}`}
                className={cn(
                  'flex min-w-0 items-stretch gap-3 md:max-w-[22%] md:min-w-0 md:w-auto md:flex-1 md:shrink-0 md:flex-col md:items-center md:gap-0',
                  !isLast ? 'pb-5 md:pb-0' : '',
                )}
              >
                {/* Mobil: dikey ray + nokta */}
                <div className="relative flex w-4 shrink-0 flex-col items-center self-stretch md:hidden">
                  <span
                    className={cn(
                      'relative z-[1] mt-0.5 flex h-3.5 w-3.5 shrink-0 rounded-full border-[2px] border-background',
                      'bg-gradient-to-br from-primary to-primary/85 shadow-sm ring-2 ring-primary/25',
                      isLast && 'ring-emerald-500/35',
                    )}
                    aria-hidden
                  />
                  {!isLast ? (
                    <span
                      className="pointer-events-none absolute left-1/2 top-[18px] bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/40 via-primary/20 to-muted-foreground/20"
                      aria-hidden
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 md:flex md:w-full md:flex-col md:items-center">
                  {/* Tablet+: yatay bağlayıcı çizgiler */}
                  <div className="hidden w-full items-center justify-center md:flex">
                    <span
                      className={cn(
                        'h-[3px] flex-1 rounded-full',
                        i === 0 ? 'max-w-[12px] opacity-0' : 'bg-gradient-to-r from-muted-foreground/20 to-primary/35',
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        'relative z-[1] mx-2 flex h-4 w-4 shrink-0 rounded-full border-[2px] border-background',
                        'bg-gradient-to-br from-primary to-primary/85 shadow-sm ring-2 ring-primary/25',
                        isLast && 'ring-emerald-500/35',
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        'h-[3px] flex-1 rounded-full',
                        isLast ? 'max-w-[12px] opacity-0' : 'bg-gradient-to-r from-primary/35 to-muted-foreground/15',
                      )}
                      aria-hidden
                    />
                  </div>
                  <time className="mt-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground md:mt-3 md:text-center md:whitespace-nowrap">
                    {tinyDate(row.date, locale)}
                  </time>
                  <p
                    className="mt-1.5 line-clamp-4 text-left text-[11px] leading-snug text-foreground md:mt-2 md:text-center md:line-clamp-4"
                    title={label}
                  >
                    {label}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
