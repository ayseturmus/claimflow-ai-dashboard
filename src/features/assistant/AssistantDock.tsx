import { Bot, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { mockAssistantReply } from '@/features/assistant/mockAssistant'
import { ASSISTANT_QUICK_SUGGESTION_KEYS } from '@/features/assistant/quickSuggestionKeys'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function mockTypingDelayMs() {
  return 450 + Math.floor(Math.random() * 450)
}

/**
 * Sağ alttaki yuvarlak buton; panel aynı köşeden büyüyerek sola doğru açılır (origin-bottom-right).
 */
export function AssistantDock() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {!open ? (
        <Button
          type="button"
          size="icon"
          aria-label={t('assistant.fabLabel')}
          aria-expanded={false}
          className={cn(
            'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
            'touch-manipulation',
          )}
          onClick={() => setOpen(true)}
        >
          <Bot className="size-7" aria-hidden strokeWidth={2} />
        </Button>
      ) : null}

      {open ? (
        <button
          type="button"
          aria-label={t('assistant.closeChat')}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          'fixed z-50 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/[0.05] dark:ring-white/[0.06]',
          'bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1.5rem,env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6',
          'top-12 sm:top-[4.5rem]',
          'w-[min(20rem,calc(100vw-3rem))]',
          'origin-bottom-right transform-gpu transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open
            ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none scale-[0.22] opacity-0',
        )}
        aria-hidden={!open}
      >
        <AssistantChat key={i18n.language} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}

function AssistantChat({
  onClose,
}: {
  onClose?: () => void
}) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: t('assistant.welcome'),
    },
  ])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messageSeq = useRef(0)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  function pushMessage(role: ChatMessage['role'], content: string) {
    messageSeq.current += 1
    const id = `msg-${messageSeq.current}`
    setMessages((prev) => [...prev, { id, role, content }])
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    pushMessage('user', trimmed)
    setDraft('')
    setThinking(true)

    window.setTimeout(() => {
      const reply = mockAssistantReply(trimmed, t)
      pushMessage('assistant', reply)
      setThinking(false)
    }, mockTypingDelayMs())
  }

  function handleSend() {
    sendUserMessage(draft)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-border bg-card px-3 py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="size-5" aria-hidden />
          </div>
          <div className="space-y-1 text-left">
            <h2 className="text-base font-semibold leading-tight text-foreground">
              {t('assistant.title')}
            </h2>
            <p className="text-xs leading-snug text-muted-foreground">{t('assistant.subtitle')}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 touch-manipulation"
          onClick={onClose}
          aria-label={t('assistant.closeChat')}
        >
          <X className="size-5" />
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-background/50">
        <div className="space-y-2.5 px-3 py-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'max-w-[95%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground shadow-sm'
                  : 'mr-auto border border-border bg-card text-card-foreground shadow-sm',
              )}
            >
              {m.content}
            </div>
          ))}
          {thinking ? (
            <div className="mr-auto max-w-[95%] rounded-2xl border border-border bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              {t('assistant.thinking')}
            </div>
          ) : null}
          <div ref={scrollRef} />
        </div>
      </div>

      <footer className="shrink-0 space-y-3 border-t border-border bg-card p-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {t('assistant.quickSuggestionsTitle')}
          </Label>
          <div className="flex max-h-[9.5rem] flex-wrap gap-1.5 overflow-y-auto pr-0.5">
            {ASSISTANT_QUICK_SUGGESTION_KEYS.map((key) => {
              const label = t(key)
              return (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={thinking}
                  className={cn(
                    'h-auto min-h-8 max-w-full touch-manipulation justify-start px-2 py-1.5 text-left text-[11px] font-normal leading-snug whitespace-normal',
                  )}
                  onClick={() => sendUserMessage(label)}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('assistant.placeholder')}
            rows={1}
            className="min-h-9 max-h-24 flex-1 resize-none py-2 text-sm leading-snug"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="mb-0.5 shrink-0 touch-manipulation px-3"
            disabled={thinking || !draft.trim()}
            onClick={handleSend}
          >
            {t('assistant.send')}
          </Button>
        </div>
      </footer>
    </div>
  )
}
