import type { TFunction } from 'i18next'
import { z } from 'zod'

/** Validates note form with localized error messages. */
export function createNoteFormSchema(t: TFunction) {
  return z.object({
    text: z
      .string()
      .trim()
      .min(1, t('validation.noteRequired'))
      .max(2000, t('validation.noteTooLong')),
  })
}

export type NoteFormValues = z.infer<
  ReturnType<typeof createNoteFormSchema>
>

const insuredVehicleSchema = z
  .object({
    plate: z.string().optional(),
    brand: z.string(),
    model: z.string(),
    modelYear: z.string(),
    vin: z.string().optional(),
    usageTypeKey: z.string().optional(),
  })
  .optional()

const policySchema = z
  .object({
    productLineKey: z.string(),
    policyNumber: z.string(),
    validFrom: z.string(),
    validTo: z.string(),
    /** Sigortalı adı soyadı (teşhir). */
    policyholderFullName: z.string().optional(),
    insuredVehicle: insuredVehicleSchema,
    coverageSlugKeys: z.array(z.string()),
  })
  .optional()

const incidentStatusKeySchema = z.enum([
  'registered',
  'documents_pending',
  'under_review',
  'closed',
])

const incidentMilestoneSchema = z.object({
  date: z.string(),
  stepKey: z.string(),
  complete: z.boolean(),
})

const incidentRepairSchema = z.object({
  lastUpdated: z.string(),
  workshopName: z.string(),
  summaryKey: z.string(),
})

const incidentCostsSchema = z.object({
  lastUpdated: z.string(),
  estimateStatusKey: z.enum(['pending', 'preliminary', 'final']),
  preliminaryAmount: z.string().optional(),
  finalExpectedBy: z.string().optional(),
  summaryKey: z.string(),
})

export const incidentSchema = z.object({
  id: z.string(),
  occurredAt: z.string(),
  statusKey: incidentStatusKeySchema,
  milestones: z.array(incidentMilestoneSchema).optional(),
  repair: incidentRepairSchema.optional(),
  costs: incidentCostsSchema.optional(),
})

export type IncidentRecord = z.infer<typeof incidentSchema>
export type IncidentStatusKey = z.infer<typeof incidentStatusKeySchema>

const documentRequestSchema = z.object({
  incidentId: z.string(),
  docKey: z.string(),
  urgent: z.boolean().optional(),
})

const towingUsageSchema = z.object({
  used: z.number().int().min(0),
  limit: z.number().int().min(0),
})

const authorizedServiceSchema = z.object({
  workshopName: z.string(),
  address: z.string(),
  phones: z.array(z.string()).default([]),
})

const paymentLedgerItemSchema = z.object({
  date: z.string(),
  purposeKey: z.string(),
  amount: z.string().optional(),
})

const fileActivityItemSchema = z.object({
  date: z.string(),
  eventKey: z.string(),
})

/** İkame araç teminatı kullanım özeti — dosya yanıtından. */
const substituteEntitlementSchema = z.object({
  used: z.number().int().min(0),
  limit: z.number().int().min(0),
})

/** Sigorta puanı / sadakat göstergesi (0–100). */
const insuranceLoyaltySchema = z.object({
  score: z.number().int().min(0).max(100),
  tierKey: z.string().optional(),
})

export const claimProcessSchema = z.object({
  title: z.string(),
  fileNo: z.string(),
  estimatedRemainingTime: z.string(),
  currentStatus: z.string(),
  policy: policySchema,
  documentRequests: z.array(documentRequestSchema).default([]),
  incidents: z.array(incidentSchema).default([]),
  processDetails: z.array(z.record(z.string(), z.unknown())),
  /** Poliçe kapsamı çekici kullanım özeti. */
  towingUsage: towingUsageSchema.optional(),
  /** Aktif dosyaya bağlı yetkili servis iletişimi. */
  authorizedService: authorizedServiceSchema.optional(),
  /** Yapılan ödemeler ve kesinti kayıtları. */
  paymentLedger: z.array(paymentLedgerItemSchema).optional(),
  /** Dosya gelişmeleri — kısa kronolojik satırlar. */
  fileActivityTimeline: z.array(fileActivityItemSchema).optional(),
  substituteEntitlement: substituteEntitlementSchema.optional(),
  insuranceLoyalty: insuranceLoyaltySchema.optional(),
})

export type ClaimProcess = z.infer<typeof claimProcessSchema>

export type ProcessStep = {
  title: string
  status: string
} & Record<string, unknown>
