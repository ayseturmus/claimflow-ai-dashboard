/** Tam süreç kartları ile özet ray aynı segment renklerini paylaşır */
export function timelineSegmentConnectorClass(
  fromVariant: 'done' | 'current' | 'upcoming',
): string {
  if (fromVariant === 'done') {
    return 'bg-gradient-to-b from-emerald-400/70 via-emerald-400/35 to-emerald-300/20'
  }
  if (fromVariant === 'current') {
    return 'bg-gradient-to-b from-primary/50 via-primary/25 to-muted-foreground/18'
  }
  return 'bg-muted-foreground/18'
}
