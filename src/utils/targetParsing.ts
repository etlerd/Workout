const PLAIN_NUMBER_RANGE = /^(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?$/
const MINUTE_RANGE = /^(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*min/i
const ANY_NUMBER_RANGE = /(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?/

function average(low: string, high: string | undefined): number {
  const lowNum = parseFloat(low)
  const highNum = high ? parseFloat(high) : lowNum
  return Math.round((lowNum + highNum) / 2)
}

export interface ParsedTargetReps {
  reps?: number
  durationMin?: number
}

export function parseTargetReps(target: string | undefined): ParsedTargetReps {
  if (!target) return {}
  const trimmed = target.trim()

  const plainMatch = trimmed.match(PLAIN_NUMBER_RANGE)
  if (plainMatch) {
    return { reps: average(plainMatch[1], plainMatch[2]) }
  }

  const minuteMatch = trimmed.match(MINUTE_RANGE)
  if (minuteMatch) {
    return { durationMin: average(minuteMatch[1], minuteMatch[2]) }
  }

  return {}
}

export function parseTargetWeight(target: string | undefined): number | undefined {
  if (!target) return undefined
  const lower = target.toLowerCase()
  if (lower.includes('resistance') || lower.includes('level')) return undefined

  const match = target.match(ANY_NUMBER_RANGE)
  if (!match) return undefined
  return average(match[1], match[2])
}
