export function statusBadgeVariant(
  status: string,
): 'success' | 'warning' | 'outline' | 'secondary' {
  const s = status.toLowerCase()
  if (s.includes('completed') || s.includes('report completed')) return 'success'
  if (s.includes('progress')) return 'warning'
  if (s.includes('pending')) return 'outline'
  return 'secondary'
}
