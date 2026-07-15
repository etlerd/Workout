// Date-only strings (YYYY-MM-DD) must be parsed and formatted using local
// time throughout the app. `new Date("YYYY-MM-DD")` parses as UTC midnight,
// which shifts the displayed date back a day in any timezone behind UTC —
// always go through these helpers instead of `new Date(dateStr)` directly.

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function localDateStr(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
