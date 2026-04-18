import { Check, CircleDot } from 'lucide-react'

import { timelineSegmentConnectorClass } from '@/components/timeline/timelineSegmentConnector'
import { cn } from '@/lib/utils'

export type TimelineRailVariant = 'done' | 'current' | 'upcoming'

export type TimelineRailItem = {
  id: string
  dateDisplay: string
  dateIso?: string
  title: string
  detail?: string
  variant: TimelineRailVariant
}

type TimelineRailProps = {
  items: TimelineRailItem[]
  /** Ana sayfa gibi daha sıkı yerleşim */
  density?: 'comfortable' | 'compact'
  /** Üstte ilerleme çubuğu (tamamlanan / toplam) */
  showProgress?: boolean
  /** İlerleme çubuğu etiketi */
  progressLabel?: string
  className?: string
  'aria-label'?: string
}

type TimelineRailMarkerProps = {
  variant: TimelineRailVariant
  compact?: boolean
  /** upcoming durumunda gösterilen sıra numarası (1 tabanlı) */
  stepNumber: number
}

export function TimelineRailMarker({ variant, compact, stepNumber }: TimelineRailMarkerProps) {
  return (
    <div
      className={cn(
        'relative z-[1] flex shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200',
        compact ? 'h-9 w-9' : 'h-10 w-10',
        variant === 'done' &&
          'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-900/10 ring-2 ring-white dark:ring-zinc-950',
        variant === 'current' &&
          cn(
            'bg-gradient-to-br from-primary to-primary/88 text-primary-foreground',
            'shadow-md shadow-primary/20 ring-[3px] ring-primary/20',
          ),
        variant === 'upcoming' &&
          cn(
            'border border-border/80 bg-background text-muted-foreground',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:bg-muted/30',
          ),
      )}
      aria-hidden
    >
      {variant === 'done' ? (
        <Check className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4', 'stroke-[2.5]')} />
      ) : variant === 'current' ? (
        <CircleDot className={cn(compact ? 'h-5 w-5' : 'h-[22px] w-[22px]')} strokeWidth={2} />
      ) : (
        <span className="text-[10px] font-semibold tabular-nums opacity-75">{stepNumber}</span>
      )}
    </div>
  )
}

export function TimelineRail({
  items,
  density = 'comfortable',
  showProgress,
  progressLabel,
  className,
  'aria-label': ariaLabel,
}: TimelineRailProps) {
  const doneCount = items.filter((i) => i.variant === 'done').length
  const pct = items.length ? (doneCount / items.length) * 100 : 0
  const compact = density === 'compact'

  return (
    <div className={cn('relative', className)} aria-label={ariaLabel}>
      {showProgress ? (
        <div className="mb-8 space-y-2.5">
          {progressLabel ? (
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/90">
              {progressLabel}
            </p>
          ) : null}
          <div
            className="mx-auto max-w-md overflow-hidden rounded-full bg-muted/60 p-[3px] ring-1 ring-border/40"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${doneCount} / ${items.length}`}
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full min-w-[4px] rounded-full bg-gradient-to-r from-emerald-500/90 via-teal-500/85 to-primary/90 transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="text-center text-[11px] font-medium tabular-nums text-muted-foreground/90">
            {doneCount}/{items.length}
          </p>
        </div>
      ) : null}

      <ul className="relative m-0 list-none space-y-0 p-0">
        {items.map((item, idx) => {
          const isLast = idx >= items.length - 1
          const showConnector = !isLast

          return (
            <li key={item.id} className={cn('flex items-stretch gap-3 sm:gap-4', compact ? 'pb-6 last:pb-1' : 'pb-10 last:pb-2')}>
              {/* Sol ray: düğüm + segment */}
              <div className={cn('flex shrink-0 flex-col items-center', compact ? 'w-10 sm:w-11' : 'w-11 sm:w-12')}>
                <TimelineRailMarker variant={item.variant} compact={compact} stepNumber={idx + 1} />
                {showConnector ? (
                  <div
                    className={cn(
                      'mt-2 w-[2px] flex-1 rounded-full',
                      timelineSegmentConnectorClass(item.variant),
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>

              <div
                className={cn(
                  'min-w-0 flex-1 rounded-2xl border px-4 py-3.5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] backdrop-blur-[2px]',
                  compact && 'rounded-xl px-3.5 py-3',
                  item.variant === 'done' &&
                    'border-emerald-200/45 bg-gradient-to-br from-emerald-50/60 via-background to-background dark:border-emerald-900/35 dark:from-emerald-950/30',
                  item.variant === 'current' &&
                    cn(
                      'border-primary/25 bg-gradient-to-br from-primary/[0.07] via-background to-background',
                      'ring-1 ring-primary/15',
                    ),
                  item.variant === 'upcoming' &&
                    'border-border/55 bg-muted/15 text-foreground/95 dark:bg-muted/10',
                )}
              >
                {item.dateDisplay ? (
                  <time
                    className="inline-flex rounded-full border border-border/40 bg-muted/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    dateTime={item.dateIso}
                  >
                    {item.dateDisplay}
                  </time>
                ) : null}
                <p
                  className={cn(
                    'font-semibold leading-snug tracking-tight text-foreground',
                    compact ? 'text-[14px]' : 'text-[15px]',
                    item.dateDisplay ? 'mt-2' : 'mt-0',
                  )}
                >
                  {item.title}
                </p>
                {item.detail ? (
                  <p
                    className={cn(
                      'mt-1.5 text-sm leading-relaxed text-muted-foreground',
                      compact && 'line-clamp-2 text-[13px] leading-snug',
                    )}
                  >
                    {item.detail}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
