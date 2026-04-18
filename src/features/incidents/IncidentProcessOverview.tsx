import { useTranslation } from 'react-i18next'

import { TimelineRail } from '@/components/timeline/TimelineRail'
import { Card, CardContent } from '@/components/ui/card'
import type { IncidentRecord } from '@/features/claim/schemas'
import { buildIncidentMilestoneRailItems } from '@/features/incidents/milestoneTimeline'
import { formatIncidentDate } from '@/features/incidents/incidentUi'
import { cn } from '@/lib/utils'

type IncidentProcessOverviewProps = {
  incident: IncidentRecord
  locale: string
}

export function IncidentProcessOverview({
  incident,
  locale,
}: IncidentProcessOverviewProps) {
  const { t } = useTranslation()

  const milestones = incident.milestones ?? []
  const repair = incident.repair
  const costs = incident.costs

  const showSummaryStrip = !!(repair ?? costs)

  const milestoneItems =
    milestones.length > 0 ? buildIncidentMilestoneRailItems(milestones, locale, t) : []

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          {t('incidents.overview.pageIntroTitle')}
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          {t('incidents.overview.pageIntroSubtitle')}
        </p>
      </div>

      {showSummaryStrip ? (
        <Card className="shadow-none ring-1 ring-black/[0.06]">
          <CardContent className="grid gap-6 p-5 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border md:p-6">
            {repair ? (
              <div className={cn('min-w-0 space-y-2', costs && 'md:pr-6')}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t('incidents.overview.vehicleCardTitle')}
                </p>
                <p className="font-semibold leading-snug text-foreground">{repair.workshopName}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {t('incidents.overview.lastUpdatedLabel')}:{' '}
                  </span>
                  <time dateTime={repair.lastUpdated}>
                    {formatIncidentDate(repair.lastUpdated, locale)}
                  </time>
                </p>
                <p className="text-sm leading-snug text-muted-foreground line-clamp-3">
                  {t(`incidents.summaries.${repair.summaryKey}`)}
                </p>
              </div>
            ) : null}

            {costs ? (
              <div className={cn('min-w-0 space-y-3', repair && 'md:pl-6')}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t('incidents.overview.costsCardTitle')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {t(`incidents.costEstimate.${costs.estimateStatusKey}`)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('incidents.overview.lastUpdatedLabel')}:{' '}
                    <time dateTime={costs.lastUpdated}>
                      {formatIncidentDate(costs.lastUpdated, locale)}
                    </time>
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {costs.preliminaryAmount ? (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('incidents.overview.preliminaryAmountLabel')}
                      </p>
                      <p className="font-mono font-semibold tabular-nums text-foreground">
                        {costs.preliminaryAmount}
                      </p>
                    </div>
                  ) : null}
                  {costs.finalExpectedBy ? (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('incidents.overview.finalByLabel')}
                      </p>
                      <p className="font-medium">
                        <time dateTime={costs.finalExpectedBy}>
                          {formatIncidentDate(costs.finalExpectedBy, locale)}
                        </time>
                      </p>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {t(`incidents.summaries.${costs.summaryKey}`)}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {milestoneItems.length ? (
        <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-muted/25 via-background to-background shadow-none ring-1 ring-black/[0.05]">
          <CardContent className="p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t('incidents.overview.timelineVisualTitle')}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <TimelineRail
              items={milestoneItems}
              density="comfortable"
              showProgress
              progressLabel={t('incidents.overview.timelineProgressLabel')}
              aria-label={t('incidents.overview.timelineAria')}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
