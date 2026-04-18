import {
  Award,
  CarFront,
  CreditCard,
  MapPin,
  Phone,
  Truck,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { ClaimProcess } from '@/features/claim/schemas'
import { cn } from '@/lib/utils'

function formatShortDate(isoLike: string, locale: string) {
  const d = new Date(isoLike)
  if (Number.isNaN(d.getTime())) return isoLike
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(d)
}

type MetricShellProps = {
  icon: ReactNode
  accentClass: string
  children: ReactNode
}

function MetricShell({ icon, accentClass, children }: MetricShellProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[140px] flex-col rounded-xl border border-border/40 bg-card/80 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
        'ring-1 ring-black/[0.03] backdrop-blur-[2px] dark:bg-card/40 dark:ring-white/[0.05]',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            accentClass,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-2">{children}</div>
      </div>
    </div>
  )
}

export function FileProcessOverview({ claim }: { claim: ClaimProcess }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('tr') ? 'tr-TR' : 'en-US'

  const towing = claim.towingUsage
  const substitute = claim.substituteEntitlement
  const loyalty = claim.insuranceLoyalty

  const towingRem = useMemo(
    () => (towing ? Math.max(0, towing.limit - towing.used) : null),
    [towing],
  )
  const substituteRem = useMemo(
    () => (substitute ? Math.max(0, substitute.limit - substitute.used) : null),
    [substitute],
  )

  const payments = claim.paymentLedger ?? []
  const service = claim.authorizedService

  const [appointmentDraft, setAppointmentDraft] = useState('')
  const [appointmentOutcome, setAppointmentOutcome] = useState<'idle' | 'booked' | 'callback'>('idle')

  const visiblePayments = payments.slice(0, 2)
  const extraPaymentCount = Math.max(0, payments.length - visiblePayments.length)

  const hasMetrics = Boolean(towing || substitute || payments.length > 0 || loyalty)
  const hasAny = Boolean(hasMetrics || service)
  if (!hasAny) return null

  function translatePaymentPurpose(key: string) {
    const path = `fileProcess.paymentPurpose.${key}`
    const out = t(path)
    return out === path ? key : out
  }

  function tierLabel(key?: string) {
    if (!key) return null
    const path = `fileProcess.loyaltyTier.${key}`
    const out = t(path)
    return out === path ? null : out
  }

  /** Randevu metninde uygunluk belirsizliği algılanırsa takvim yerine geri arama akışı. */
  function inferAppointmentNeedsCallback(text: string): boolean {
    const s = text.trim().toLowerCase()
    return (
      /uygun\s*değil|müsait\s*değil|müsait\s*yok|uygunsuz|net\s*değil|uygun\s*değil/i.test(s) ||
      /not\s+available|unavailable|unsure|call\s+back|cannot\s+confirm/i.test(s)
    )
  }

  function submitAppointment() {
    const trimmed = appointmentDraft.trim()
    if (!trimmed) return
    setAppointmentOutcome(inferAppointmentNeedsCallback(trimmed) ? 'callback' : 'booked')
  }

  const appointmentLocked = appointmentOutcome !== 'idle'

  return (
    <div className="mb-10 w-full space-y-5">
      {hasMetrics ? (
        <>
          <p className="max-w-3xl text-[11px] leading-relaxed text-muted-foreground/95">{t('fileProcess.metricsZoneHint')}</p>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {towing ? (
              <MetricShell accentClass="bg-primary/12 text-primary" icon={<Truck className="h-4 w-4" aria-hidden />}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t('fileProcess.towingTitle')}
                </p>
                <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
                  {towing.used}/{towing.limit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('fileProcess.towingRemaining', { count: towingRem ?? 0 })}
                </p>
                <p className="text-[10px] text-muted-foreground/90">{t('fileProcess.towingEntitled', { limit: towing.limit })}</p>
              </MetricShell>
            ) : null}

            {substitute ? (
              <MetricShell
                accentClass="bg-sky-500/12 text-sky-700 dark:text-sky-300"
                icon={<CarFront className="h-4 w-4" aria-hidden />}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t('fileProcess.substituteTitle')}
                </p>
                <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
                  {substitute.used}/{substitute.limit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('fileProcess.substituteRemaining', { count: substituteRem ?? 0 })}
                </p>
                <p className="text-[10px] text-muted-foreground/90">{t('fileProcess.substituteLimit', { limit: substitute.limit })}</p>
              </MetricShell>
            ) : null}

            {payments.length > 0 ? (
              <MetricShell
                accentClass="bg-emerald-600/10 text-emerald-800 dark:text-emerald-300"
                icon={<CreditCard className="h-4 w-4" aria-hidden />}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t('fileProcess.paymentsTitle')}
                </p>
                <p className="text-lg font-semibold tabular-nums text-foreground">
                  {t('fileProcess.paymentsCompact', { count: payments.length })}
                </p>
                <ul className="space-y-1.5 text-[11px] leading-snug text-muted-foreground">
                  {visiblePayments.map((p, i) => (
                    <li key={`${p.date}-${p.purposeKey}-${i}`} className="border-b border-border/30 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-medium text-foreground/85">{formatShortDate(p.date, locale)}</span>
                      {' · '}
                      <span>{translatePaymentPurpose(p.purposeKey)}</span>
                      {p.amount ? (
                        <span className="mt-0.5 block tabular-nums text-foreground/70">{p.amount}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {extraPaymentCount > 0 ? (
                  <p className="text-[10px] font-medium text-muted-foreground">
                    {t('fileProcess.paymentsMore', { count: extraPaymentCount })}
                  </p>
                ) : null}
              </MetricShell>
            ) : null}

            {loyalty ? (
              <MetricShell
                accentClass="bg-amber-500/12 text-amber-800 dark:text-amber-200"
                icon={<Award className="h-4 w-4" aria-hidden />}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {t('fileProcess.loyaltyTitle')}
                </p>
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-lg font-semibold tabular-nums text-foreground">
                    {t('fileProcess.loyaltyScoreLabel', { score: loyalty.score })}
                  </p>
                  {tierLabel(loyalty.tierKey) ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100">
                      {tierLabel(loyalty.tierKey)}
                    </span>
                  ) : null}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500/90 via-primary/80 to-primary"
                    style={{ width: `${loyalty.score}%` }}
                  />
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">{t('fileProcess.loyaltyHint')}</p>
              </MetricShell>
            ) : null}
          </div>
        </>
      ) : null}

      {service ? (
        <div className="flex w-full justify-center px-1">
          <Card
            className={cn(
              'w-full max-w-sm overflow-hidden rounded-2xl border-border/45 bg-card/95 shadow-md',
              'ring-1 ring-black/[0.05] dark:ring-white/[0.06]',
            )}
          >
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('fileProcess.workshopTitle')}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{service.workshopName}</p>
            </div>

            <div className="flex gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
              <span className="text-[13px] leading-relaxed">{service.address}</span>
            </div>

            {service.phones.length > 0 ? (
              <div className="flex flex-col gap-2">
                {service.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                  >
                    <Phone className="h-3 w-3" aria-hidden />
                    {phone}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 dark:bg-muted/10">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {t('fileProcess.appointmentLabel')}
              </p>
              <Textarea
                value={appointmentDraft}
                onChange={(e) => setAppointmentDraft(e.target.value)}
                placeholder={t('fileProcess.appointmentPlaceholder')}
                rows={2}
                disabled={appointmentLocked}
                className="mb-2 min-h-[56px] resize-none text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="touch-manipulation"
                disabled={appointmentLocked || !appointmentDraft.trim()}
                onClick={submitAppointment}
              >
                {t('fileProcess.appointmentSubmit')}
              </Button>
              {appointmentOutcome === 'booked' ? (
                <div className="mt-3 space-y-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-[12px] leading-snug text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-50">
                  <p className="font-semibold">{t('fileProcess.appointmentBookedLine1')}</p>
                  <p className="text-emerald-900/95 dark:text-emerald-100/95">{t('fileProcess.appointmentBookedLine2')}</p>
                </div>
              ) : null}
              {appointmentOutcome === 'callback' ? (
                <div className="mt-3 space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[12px] leading-snug text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-50">
                  <p className="font-semibold">{t('fileProcess.appointmentCallbackLine1')}</p>
                  <p className="text-amber-950/95 dark:text-amber-100/95">{t('fileProcess.appointmentCallbackLine2')}</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        </div>
      ) : null}
    </div>
  )
}
