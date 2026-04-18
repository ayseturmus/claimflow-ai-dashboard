import { claimProcessSchema, type ClaimProcess } from '@/features/claim/schemas'

export async function fetchClaimProcess(): Promise<ClaimProcess> {
  const response = await fetch('/claim-process.json')
  if (!response.ok) {
    throw new Error(`Failed to load claim data (${response.status})`)
  }
  const json: unknown = await response.json()
  return claimProcessSchema.parse(json)
}
