import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DashboardSummaryMetrics } from '@/features/claim/DashboardSummaryMetrics'
import { pickDocumentUploadIncidentId } from '@/features/claim/documentUploadTarget'
import { IncidentCardsSection } from '@/features/incidents/IncidentCardsSection'
import { deriveActionLine } from '@/features/claim/claimSummary'
import { fetchClaimProcess } from '@/features/claim/api'
import { FileActivityStrip } from '@/features/claim/FileActivityStrip'
import { FileProcessOverview } from '@/features/claim/FileProcessOverview'
import { PolicySection } from '@/features/claim/PolicySection'
import {
  policyholderFirstName,
  policyholderInitials,
} from '@/features/claim/policyholderDisplay'
import {
  translateFixtureCurrentStatus,
  translateFixtureEta,
} from '@/i18n/display'

export function ClaimDashboard() {
  const { t } = useTranslation()

  const q = useQuery({
    queryKey: ['claim-process'],
    queryFn: fetchClaimProcess,
    staleTime: 60_000,
  })

  if (q.isPending) {
    return (
      <div className="min-h-dvh text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (q.isError) {
    return (
      <div className="min-h-dvh text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-destructive">{t('errorLoad')}</p>
        </div>
      </div>
    )
  }

  const claim = q.data
  const actionLine = deriveActionLine(claim, t)
  const hasUrgentDocument = (claim.documentRequests ?? []).some((r) => r.urgent)
  const hasPendingAction = actionLine !== t('summary.noAction')
  const uploadIncidentId = pickDocumentUploadIncidentId(claim)

  const holderName = claim.policy?.policyholderFullName?.trim()
  const avatarLetters = holderName ? policyholderInitials(holderName) : 'CF'

  return (
    <div className="min-h-dvh text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <header className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.04]">
          <div
            className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60"
            aria-hidden
          />
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-tight text-primary-foreground shadow-inner"
                  aria-hidden
                >
                  {avatarLetters}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold tracking-tight text-foreground">
                    {t('layout.brandName')}
                  </p>
                  {holderName ? (
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {t('layout.welcomeInsured', {
                        name: policyholderFirstName(holderName),
                      })}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{t('layout.portalTagline')}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-4 md:flex-col md:items-end lg:flex-row lg:items-center">
                <LanguageSwitcher variant="compact" />
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-right shadow-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t('policy.policyNumberLabel')}
                  </p>
                  <p className="font-mono text-sm font-semibold tabular-nums tracking-tight text-foreground">
                    {claim.policy?.policyNumber ?? claim.fileNo}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h1 className="text-balance text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
                {t('layout.heroLead')}
              </h1>
            </div>
          </div>
        </header>

        <DashboardSummaryMetrics
          aria-label={t('timeline.ariaSummary')}
          statusBody={translateFixtureCurrentStatus(claim.currentStatus, t)}
          etaBody={translateFixtureEta(claim.estimatedRemainingTime, t)}
          actionBody={actionLine}
          hasActionOrUrgent={hasPendingAction}
          hasUrgentDocument={hasUrgentDocument}
          uploadIncidentId={uploadIncidentId}
        />

        <FileActivityStrip claim={claim} />

        <IncidentCardsSection incidents={claim.incidents} />

        <PolicySection claim={claim} />

        <section
          id="claim-file-process"
          className="mt-12 w-full scroll-mt-24 text-left"
          aria-label={t('timeline.ariaTimeline')}
        >
          <div className="mb-8 max-w-3xl space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t('timeline.title')}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('timeline.subtitle')}</p>
            <p className="text-xs leading-relaxed text-muted-foreground/90">{t('timeline.assistantHint')}</p>
          </div>

          <FileProcessOverview claim={claim} />
        </section>
      </div>
    </div>
  )
}
