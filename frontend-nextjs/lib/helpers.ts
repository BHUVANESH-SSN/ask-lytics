/**
 * Format timestamp to relative time (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatRelativeTime(dateInput: Date | string | number): string {
  const now = new Date()
  const past = new Date(dateInput)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 10) {
    return "just now"
  } else if (diffSecs < 60) {
    return `${diffSecs} second${diffSecs === 1 ? "" : "s"} ago`
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  } else if (diffDays === 1) {
    return "yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`
  } else {
    return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`
  }
}

/**
 * Get user initials from name
 */
export function getUserInitials(name: string): string {
  if (!name) return "U"

  const parts = name.trim().split(" ")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
