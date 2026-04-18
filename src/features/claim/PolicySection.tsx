import {
  BadgeCheck,
  CalendarDays,
  Car,
  Check,
  Hash,
  Shield,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import type { ClaimProcess } from '@/features/claim/schemas'
import { cn } from '@/lib/utils'

export function PolicySection({ claim }: { claim: ClaimProcess }) {
  const { t } = useTranslation()
  const policy = claim.policy

  if (!policy) return null

  const productName = t(`policy.productLines.${policy.productLineKey}`)
  const vehicle = policy.insuredVehicle

  return (
    <section
      className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch"
      aria-label={t('policy.productSectionTitle')}
    >
      {/* Poliçe + araç */}
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-card',
          'shadow-md shadow-primary/5 ring-1 ring-primary/10',
        )}
      >
        <div className="border-b border-primary/10 bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-inner">
              <Shield className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/90">
                {t('policy.productSectionTitle')}
              </p>
              <p className="mt-1.5 text-balance text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                {productName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 shadow-sm dark:bg-background/50">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Hash className="h-3 w-3" aria-hidden />
                {t('policy.policyNumberLabel')}
              </div>
              <p className="mt-2 font-mono text-base font-bold tabular-nums tracking-tight text-foreground">
                {policy.policyNumber}
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 shadow-sm dark:bg-background/50">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-3 w-3" aria-hidden />
                {t('policy.periodLabel')}
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-foreground">
                {t('policy.periodValue', {
                  from: policy.validFrom,
                  to: policy.validTo,
                })}
              </p>
            </div>
          </div>

          {vehicle ? (
            <div className="rounded-xl border border-border bg-muted/25 p-4 ring-1 ring-black/[0.03] dark:bg-muted/15">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <Car className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('policy.vehicleTitle')}
                    </p>
                    {vehicle.plate ? (
                      <p className="mt-2 inline-flex rounded-lg border-2 border-primary/35 bg-background px-3 py-1.5 font-mono text-lg font-bold tracking-[0.2em] text-foreground shadow-sm">
                        {vehicle.plate}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-border/60" />

              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-0.5">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t('policy.brandLabel')}
                  </dt>
                  <dd className="text-sm font-semibold text-foreground">{vehicle.brand}</dd>
                </div>
                <div className="space-y-0.5">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t('policy.yearLabel')}
                  </dt>
                  <dd className="text-sm font-semibold tabular-nums text-foreground">
                    {vehicle.modelYear}
                  </dd>
                </div>
                <div className="space-y-0.5 sm:col-span-2">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t('policy.modelLabel')}
                  </dt>
                  <dd className="text-sm font-medium leading-snug text-foreground">{vehicle.model}</dd>
                </div>
                {vehicle.vin ? (
                  <div className="space-y-0.5 sm:col-span-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {t('policy.vinLabel')}
                    </dt>
                    <dd className="break-all rounded-md bg-muted/40 px-2 py-1.5 font-mono text-xs font-medium tabular-nums text-foreground">
                      {vehicle.vin}
                    </dd>
                  </div>
                ) : null}
                {vehicle.usageTypeKey ? (
                  <div className="space-y-0.5 sm:col-span-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {t('policy.usageLabel')}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {t(`policy.usageTypes.${vehicle.usageTypeKey}`)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {/* Teminatlar */}
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-50/90 to-card dark:from-emerald-950/40 dark:to-card',
          'shadow-md shadow-emerald-900/5 ring-1 ring-emerald-500/15 dark:ring-emerald-900/40',
        )}
      >
        <div className="border-b border-emerald-500/15 bg-emerald-500/[0.09] px-5 py-4 dark:bg-emerald-950/50">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm dark:bg-emerald-700">
              <BadgeCheck className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
                {t('policy.coverageSectionTitle')}
              </p>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-emerald-950/85 dark:text-emerald-100/85">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span>{t('policy.coverageIntro')}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <ul className="grid gap-2">
            {policy.coverageSlugKeys.map((slug, idx) => (
              <li key={slug}>
                <div
                  className={cn(
                    'flex gap-3 rounded-xl border px-3 py-2.5 transition-colors',
                    idx % 2 === 0
                      ? 'border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/25'
                      : 'border-border/70 bg-background/90 dark:bg-background/40',
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/12 dark:bg-emerald-500/20">
                    <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-foreground">
                    {t(`policy.coverageItems.${slug}`)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
