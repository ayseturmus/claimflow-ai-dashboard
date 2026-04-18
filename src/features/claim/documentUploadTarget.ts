import type { ClaimProcess } from '@/features/claim/schemas'

/** İlk acil talep veya ilk kayıt — «Hemen yükle» rotası için. */
export function pickDocumentUploadIncidentId(claim: ClaimProcess): string | null {
  const reqs = claim.documentRequests ?? []
  if (!reqs.length) return null
  const urgent = reqs.find((r) => r.urgent)
  return (urgent ?? reqs[0]).incidentId
}
