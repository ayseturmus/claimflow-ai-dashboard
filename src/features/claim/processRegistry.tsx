import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  translateStepStatus,
  translateStepTitle,
} from '@/i18n/display'
import type { TimelineRailVariant } from '@/components/timeline/TimelineRail'
import type { ProcessStep } from '@/features/claim/schemas'
import { statusBadgeVariant } from '@/features/claim/stepStatus'
import { cn } from '@/lib/utils'
import { useClaimUiStore } from '@/stores/claimUiStore'

type DetailRenderer = (props: { step: ProcessStep }) => ReactNode

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function FieldGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <dt className="text-xs font-medium text-muted-foreground">
            {row.label}
          </dt>
          <dd className="text-sm leading-snug break-words">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function translateFieldLabel(key: string, t: (key: string) => string): string {
  const path = `fields.${key}`
  const translated = t(path)
  return translated !== path ? translated : formatLabel(key)
}

/** Registry pattern: map step title → specialized UI (no giant switch). */
const registry = new Map<string, DetailRenderer>()

function register(title: string, Renderer: DetailRenderer) {
  registry.set(title, Renderer)
}

function GenericDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  const rows = Object.entries(step)
    .filter(([key]) => key !== 'title' && key !== 'status')
    .map(([key, value]) => ({
      label: translateFieldLabel(key, t),
      value: stringifyValue(value),
    }))
    .filter((x) => x.value.length > 0)

  return <FieldGrid rows={rows} />
}

function TowingServiceDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.pickupLocation'),
          value: stringifyValue(step.pickupLocation),
        },
        { label: t('fields.towingDate'), value: stringifyValue(step.towingDate) },
      ]}
    />
  )
}

function ClaimNotificationDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        { label: t('fields.dateTime'), value: stringifyValue(step.dateTime) },
        { label: t('fields.reportType'), value: stringifyValue(step.reportType) },
        {
          label: t('fields.reasonForDamage'),
          value: stringifyValue(step.reasonForDamage),
        },
        {
          label: t('fields.reportingParty'),
          value: stringifyValue(step.reportingParty),
        },
        { label: t('fields.contact'), value: stringifyValue(step.contact) },
      ]}
    />
  )
}

function AppraisalDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.expertAssignmentDate'),
          value: stringifyValue(step.expertAssignmentDate),
        },
        { label: t('fields.expertInfo'), value: stringifyValue(step.expertInfo) },
      ]}
    />
  )
}

function RepairCoordinationDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[{ label: t('fields.contact'), value: stringifyValue(step.contact) }]}
    />
  )
}

function SubstituteRentalDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.vehicleDuration'),
          value: stringifyValue(step.vehicleDuration),
        },
        {
          label: t('fields.vehicleModel'),
          value: stringifyValue(step.vehicleModel),
        },
        {
          label: t('fields.extraDuration'),
          value: stringifyValue(step.extraDuration),
        },
      ]}
    />
  )
}

function FileReviewDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.reviewReferralDate'),
          value: stringifyValue(step.reviewReferralDate),
        },
        {
          label: t('fields.reviewCompletionDate'),
          value: stringifyValue(step.reviewCompletionDate),
        },
      ]}
    />
  )
}

function DeductionReasonDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <FieldGrid
        rows={[
          {
            label: t('fields.actionRequired'),
            value: stringifyValue(step.actionRequired),
          },
          {
            label: t('fields.occupationalDeduction'),
            value: stringifyValue(step.occupationalDeduction),
          },
          {
            label: t('fields.appreciationDeduction'),
            value: stringifyValue(step.appreciationDeduction),
          },
          {
            label: t('fields.policyDeductible'),
            value: stringifyValue(step.policyDeductible),
          },
        ]}
      />
      <DocumentAnalyzerPanel />
    </div>
  )
}

function FinancialSummaryDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.nonDamageAmount'),
          value: stringifyValue(step.nonDamageAmount),
        },
      ]}
    />
  )
}

function PaymentInformationDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        { label: t('fields.paidTo'), value: stringifyValue(step.paidTo) },
        { label: t('fields.iban'), value: stringifyValue(step.iban) },
        {
          label: t('fields.paymentAmount'),
          value: stringifyValue(step.paymentAmount),
        },
        { label: t('fields.note'), value: stringifyValue(step.note) },
      ]}
    />
  )
}

function ClosedDetail({ step }: { step: ProcessStep }) {
  const { t } = useTranslation()
  return (
    <FieldGrid
      rows={[
        {
          label: t('fields.completionDate'),
          value: stringifyValue(step.completionDate),
        },
      ]}
    />
  )
}

register('Towing Service', TowingServiceDetail)
register('Claim Notification', ClaimNotificationDetail)
register('Appraisal', AppraisalDetail)
register('Repair Coordination', RepairCoordinationDetail)
register('Substitute Rental Vehicle', SubstituteRentalDetail)
register('File Review', FileReviewDetail)
register('Deduction Reason', DeductionReasonDetail)
register('Financial Summary', FinancialSummaryDetail)
register('Payment Information', PaymentInformationDetail)
register('Closed', ClosedDetail)

export function RenderProcessDetailBody({ step }: { step: ProcessStep }) {
  const render = registry.get(step.title) ?? GenericDetail
  return render({ step })
}

function DocumentAnalyzerPanel() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docVerdict = useClaimUiStore((s) => s.docVerdict)
  const docFeedback = useClaimUiStore((s) => s.docFeedback)
  const setDocVerdict = useClaimUiStore((s) => s.setDocVerdict)

  async function simulateCheck(file: File | undefined) {
    setDocVerdict('checking', null)
    await new Promise((r) => setTimeout(r, 650))
    const name = file?.name.toLowerCase() ?? ''
    const looksOccupational =
      name.includes('occupational') ||
      name.includes('certificate') ||
      name.endsWith('.pdf')

    if (looksOccupational) {
      setDocVerdict('accepted', t('docAnalyzer.feedbackAccepted'))
    } else {
      setDocVerdict('rejected', t('docAnalyzer.feedbackRejected'))
    }
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{t('docAnalyzer.title')}</p>
          <p className="text-xs text-muted-foreground">{t('docAnalyzer.subtitle')}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => void simulateCheck(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="touch-manipulation"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('docAnalyzer.chooseFile')}
        </Button>
      </div>

      {docVerdict !== 'idle' ? (
        <p className="mt-3 text-sm leading-relaxed">
          <span className="font-medium">
            {docVerdict === 'checking' && t('docAnalyzer.analyzing')}
            {docVerdict === 'accepted' && t('docAnalyzer.accepted')}
            {docVerdict === 'rejected' && t('docAnalyzer.rejected')}
          </span>{' '}
          {docFeedback}
        </p>
      ) : null}
    </div>
  )
}

export function ProcessStepCard({
  step,
  footer,
  timelineVariant,
}: {
  step: ProcessStep
  footer?: ReactNode
  timelineVariant?: TimelineRailVariant
}) {
  const { t } = useTranslation()

  return (
    <Card
      className={cn(
        'text-left overflow-hidden rounded-2xl border-border/55 bg-card/95 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]',
        timelineVariant === 'current' &&
          'border-primary/28 shadow-md shadow-primary/10 ring-2 ring-primary/15',
        timelineVariant === 'done' && 'border-emerald-200/35 dark:border-emerald-900/40',
      )}
    >
      <CardHeader className="gap-2 space-y-0 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{translateStepTitle(step.title, t)}</CardTitle>
          </div>
          <Badge variant={statusBadgeVariant(step.status)}>
            {translateStepStatus(step.status, t)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RenderProcessDetailBody step={step} />
        {footer}
      </CardContent>
    </Card>
  )
}
