import { create } from 'zustand'

export type AiDocVerdict =
  | 'idle'
  | 'checking'
  | 'accepted'
  | 'rejected'

type ClaimUiState = {
  docVerdict: AiDocVerdict
  docFeedback: string | null
  setDocVerdict: (verdict: AiDocVerdict, feedback: string | null) => void
}

export const useClaimUiStore = create<ClaimUiState>((set) => ({
  docVerdict: 'idle',
  docFeedback: null,

  setDocVerdict: (verdict, feedback) =>
    set({ docVerdict: verdict, docFeedback: feedback }),
}))
