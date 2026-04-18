import type { TFunction } from 'i18next'

import { translateActionRequired } from '@/i18n/display'
import type { ClaimProcess } from '@/features/claim/schemas'

export function deriveActionLine(claim: ClaimProcess, t: TFunction): string {
  const pendingNeedingAction = claim.processDetails.find((step) => {
    const status = String(step.status ?? '').toLowerCase()
    const action = step.actionRequired
    return (
      status.includes('pending') &&
      typeof action === 'string' &&
      action.trim().length > 0
    )
  })

  if (pendingNeedingAction && pendingNeedingAction.actionRequired) {
    const raw = String(pendingNeedingAction.actionRequired)
    return translateActionRequired(raw, t)
  }

  return t('summary.noAction')
}
