import type { TFunction } from 'i18next'

/**
 * Rule-based mock assistant — no API. Matches EN/TR keywords and phrases.
 */
export function mockAssistantReply(userText: string, t: TFunction): string {
  const raw = userText.trim()
  if (!raw.length) return t('assistant.replies.default')

  const patterns: Array<{ test: RegExp; key: string }> = [
    {
      test: /referans|reference|dosya\s*no|file\s*no|claim\s*number/i,
      key: 'assistant.replies.reference',
    },
    {
      test: /status|durum|aşama|stage|where\s+am\s+i|hangi\s+aşama|ne\s+aşamas/i,
      key: 'assistant.replies.status',
    },
    {
      test: /time|süre|kalan|eta|when|ne\s+zaman|how\s+long|tahmini/i,
      key: 'assistant.replies.time',
    },
    {
      test: /document|belge|upload|yükle|pdf|certificate|meslek|occupational/i,
      key: 'assistant.replies.document',
    },
    {
      test: /deduction|kesinti|muafiyet|deductible|depreciation|amortisman/i,
      key: 'assistant.replies.deduction',
    },
    {
      test: /payment|ödeme|iban|refund|iade|paid|tutar/i,
      key: 'assistant.replies.payment',
    },
    {
      test: /\b(hi|hello|hey|merhaba|selam|iyi\s+günler|good\s+morning)\b/i,
      key: 'assistant.replies.greeting',
    },
  ]

  for (const { test, key } of patterns) {
    if (test.test(raw)) return t(key)
  }

  return t('assistant.replies.default')
}
