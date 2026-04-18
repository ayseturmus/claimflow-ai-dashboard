import { Activity, AlertCircle, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SummaryKind = 'status' | 'eta' | 'action'

type DashboardSummaryMetricsProps = {
  'aria-label': string
  statusBody: string
  etaBody: string
  actionBody: string
  hasActionOrUrgent: boolean
  hasUrgentDocument: boolean
  uploadIncidentId: string | null
}

const kindConfig: Record<
  SummaryKind,
  { icon: typeof Activity; border: string; iconWrap: string; labelKey: string; microKey: string }
> = {
  status: {
    icon: Activity,
    border: 'border-l-primary',
    iconWrap: 'bg-primary/12 text-primary',
    labelKey: 'summary.currentStatus',
    microKey: 'summary.hintStatus',
  },
  eta: {
    icon: Clock,
    border: 'border-l-amber-500',
    iconWrap: 'bg-amber-500/12 text-amber-800 dark:text-amber-200',
    labelKey: 'summary.estimatedRemaining',
    microKey: 'summary.hintEta',
  },
  action: {
    icon: AlertCircle,
    border: 'border-l-orange-500',
    iconWrap: 'bg-orange-500/12 text-orange-800 dark:text-orange-200',
    labelKey: 'summary.whatToDo',
    microKey: 'summary.hintActionFollow',
  },
}

function SummaryTile({
  kind,
  body,
  emphasis,
  uploadIncidentId,
}: {
  kind: SummaryKind
  body: string
  emphasis: boolean
  uploadIncidentId?: string | null
}) {
  const { t } = useTranslation()
  const cfg = kindConfig[kind]
  const Icon = cfg.icon

  const pulseAttention = kind === 'action' && emphasis

  const actionFooter =
    kind === 'action' && uploadIncidentId ? (
      <Button asChild size="sm" className="mt-2 w-full touch-manipulation sm:w-auto">
        <Link to={`/incidents/${uploadIncidentId}`}>{t('summary.uploadNow')}</Link>
      </Button>
    ) : kind === 'action' ? (
      <p className="text-[11px] leading-snug text-muted-foreground">{t('summary.hintActionFollow')}</p>
    ) : (
      <p className="text-[11px] leading-snug text-muted-foreground">{t(cfg.microKey)}</p>
    )

  return (
    <Card
      className={cn(
        'overflow-hidden border-l-4 text-left shadow-sm',
        cfg.border,
        'bg-card/80',
        pulseAttention &&
          'animate-urgency-nudge shadow-md shadow-orange-500/15 dark:shadow-orange-900/25',
      )}
    >
      <CardContent className="flex gap-3 p-4 pt-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            cfg.iconWrap,
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t(cfg.labelKey)}
          </p>
          <p className="text-[15px] font-semibold leading-snug tracking-tight text-foreground md:text-base">
            {body}
          </p>
          {actionFooter}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSummaryMetrics({
  'aria-label': ariaLabel,
  statusBody,
  etaBody,
  actionBody,
  hasActionOrUrgent,
  hasUrgentDocument,
  uploadIncidentId,
}: DashboardSummaryMetricsProps) {
  const emphasisAction = hasActionOrUrgent || hasUrgentDocument

  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4" aria-label={ariaLabel}>
      <SummaryTile kind="status" body={statusBody} emphasis={false} />
      <SummaryTile kind="eta" body={etaBody} emphasis={false} />
      <SummaryTile
        kind="action"
        body={actionBody}
        emphasis={emphasisAction}
        uploadIncidentId={uploadIncidentId}
      />
    </section>
  )
}
