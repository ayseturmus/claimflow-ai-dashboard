import type { TFunction } from 'i18next'

import type { TimelineRailItem } from '@/components/timeline/TimelineRail'
import type { IncidentRecord } from '@/features/claim/schemas'
import { formatIncidentDate } from '@/features/incidents/incidentUi'

export function buildIncidentMilestoneRailItems(
  milestones: NonNullable<IncidentRecord['milestones']>,
  locale: string,
  t: TFunction,
): TimelineRailItem[] {
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  let seenIncomplete = false
  return sorted.map((m, idx) => {
    let variant: TimelineRailItem['variant']
    if (m.complete) {
      variant = 'done'
    } else if (!seenIncomplete) {
      variant = 'current'
      seenIncomplete = true
    } else {
      variant = 'upcoming'
    }
    return {
      id: `${m.stepKey}-${idx}`,
      dateDisplay: formatIncidentDate(m.date, locale),
      dateIso: m.date,
      title: t(`incidents.steps.${m.stepKey}.title`),
      detail: t(`incidents.steps.${m.stepKey}.detail`),
      variant,
    }
  })
}
