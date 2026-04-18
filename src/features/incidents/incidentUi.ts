import type { BadgeProps } from '@/components/ui/badge'
import type { IncidentStatusKey } from '@/features/claim/schemas'

export function incidentStatusBadgeVariant(
  status: IncidentStatusKey,
): NonNullable<BadgeProps['variant']> {
  switch (status) {
    case 'closed':
      return 'success'
    case 'documents_pending':
      return 'warning'
    case 'under_review':
      return 'default'
    case 'registered':
    default:
      return 'secondary'
  }
}

export function formatIncidentDate(isoDate: string, localeCode: string): string {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return new Intl.DateTimeFormat(localeCode, { dateStyle: 'medium' }).format(d)
}
