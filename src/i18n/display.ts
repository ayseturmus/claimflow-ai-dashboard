import type { TFunction } from 'i18next'

/** Maps API `processDetails[].title` (English fixture) to i18n keys under `stepTitles`. */
const STEP_TITLE_TO_KEY: Record<string, string> = {
  'Claim Process': 'stepTitles.claimProcess',
  'Towing Service': 'stepTitles.towingService',
  'Claim Notification': 'stepTitles.claimNotification',
  Appraisal: 'stepTitles.appraisal',
  'Repair Coordination': 'stepTitles.repairCoordination',
  'Substitute Rental Vehicle': 'stepTitles.substituteRentalVehicle',
  'File Review': 'stepTitles.fileReview',
  'Deduction Reason': 'stepTitles.deductionReason',
  'Financial Summary': 'stepTitles.financialSummary',
  'Payment Information': 'stepTitles.paymentInformation',
  Closed: 'stepTitles.closed',
}

/** Maps API status strings from fixture to `status.*` keys. */
const STATUS_TO_KEY: Record<string, string> = {
  Completed: 'status.completed',
  'In Progress': 'status.inProgress',
  Pending: 'status.pending',
  'Report Completed': 'status.reportCompleted',
}

/** Maps API action lines to localized strings when Turkish UI is shown. */
const ACTION_TO_KEY: Record<string, string> = {
  'Upload Occupational Certificate': 'apiActions.uploadOccupationalCertificate',
}

/** Maps step title to `aiExplanation.*` translation key. */
const TITLE_TO_AI_KEY: Record<string, string> = {
  'Towing Service': 'aiExplanation.towingService',
  'Claim Notification': 'aiExplanation.claimNotification',
  Appraisal: 'aiExplanation.appraisal',
  'Repair Coordination': 'aiExplanation.repairCoordination',
  'Substitute Rental Vehicle': 'aiExplanation.substituteRentalVehicle',
  'File Review': 'aiExplanation.fileReview',
  'Deduction Reason': 'aiExplanation.deductionReason',
  'Financial Summary': 'aiExplanation.financialSummary',
  'Payment Information': 'aiExplanation.paymentInformation',
  Closed: 'aiExplanation.closed',
}

export function translateClaimTitle(raw: string, t: TFunction): string {
  const path = STEP_TITLE_TO_KEY[raw]
  return path ? t(path) : raw
}

export function translateStepTitle(raw: string, t: TFunction): string {
  const path = STEP_TITLE_TO_KEY[raw]
  return path ? t(path) : raw
}

export function translateStepStatus(raw: string, t: TFunction): string {
  const path = STATUS_TO_KEY[raw]
  return path ? t(path) : raw
}

export function translateActionRequired(raw: string, t: TFunction): string {
  const path = ACTION_TO_KEY[raw]
  return path ? t(path) : raw
}

/** Localize top summary card values when they match known fixture strings. */
export function translateFixtureCurrentStatus(raw: string, t: TFunction): string {
  if (raw.trim() === 'File Review Process Continues') {
    return t('summary.fixtureCurrentStatus')
  }
  return raw
}

export function translateFixtureEta(raw: string, t: TFunction): string {
  const m = /^(\d+)\s*[Dd]ays?$/.exec(raw.trim())
  if (m) {
    return t('summary.fixtureEta', { count: Number(m[1]) })
  }
  return raw
}

export function explainStepText(
  title: string,
  status: string,
  t: TFunction,
): string {
  const aiPath = TITLE_TO_AI_KEY[title]
  if (aiPath) return t(aiPath)
  return t('aiExplanation.fallback', {
    title: translateStepTitle(title, t),
    status: translateStepStatus(status, t),
  })
}
