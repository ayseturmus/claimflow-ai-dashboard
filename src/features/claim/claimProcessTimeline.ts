import type { TFunction } from 'i18next'

import type { TimelineRailItem, TimelineRailVariant } from '@/components/timeline/TimelineRail'
import type { ProcessStep } from '@/features/claim/schemas'
import { translateStepStatus, translateStepTitle } from '@/i18n/display'

function stepEffectivelyDone(status: string): boolean {
  const s = status.trim().toLowerCase()
  return s === 'completed' || s.includes('report completed')
}

/** Tam süreç listesi ve özet ray aynı “evre” mantığını paylaşır */
export function getProcessStepTimelineVariant(
  steps: ProcessStep[],
  index: number,
): TimelineRailVariant {
  const activeProcessIndex = steps.findIndex((s) => !stepEffectivelyDone(s.status))
  const allDone = activeProcessIndex < 0
  const focusIndex = allDone ? Math.max(0, steps.length - 1) : activeProcessIndex
  if (allDone) return 'done'
  if (index < focusIndex) return 'done'
  if (index === focusIndex) return 'current'
  return 'upcoming'
}

export function buildClaimProcessRailItems(steps: ProcessStep[], t: TFunction): TimelineRailItem[] {
  return steps.map((s, i) => {
    const variant = getProcessStepTimelineVariant(steps, i)

    return {
      id: `${i}-${s.title}`,
      dateDisplay: '',
      title: translateStepTitle(s.title, t),
      detail: translateStepStatus(s.status, t),
      variant,
    }
  })
}
