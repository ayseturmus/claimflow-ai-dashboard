/** Avatar baş harfleri: "Sude Yılmaz" → SY; tek kelimede ilk iki harf. */
export function policyholderInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase()
  }
  if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return parts[0]?.charAt(0).toUpperCase() ?? ''
}

export function policyholderFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return parts[0] ?? fullName.trim()
}
