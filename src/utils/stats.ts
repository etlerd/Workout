import type { WorkoutLog } from '../types'

export function setVolume(reps?: number, weightLb?: number): number {
  if (!reps || !weightLb) return 0
  return reps * weightLb
}

export function logVolume(log: WorkoutLog): number {
  return log.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.reduce((s, set) => s + setVolume(set.reps, set.weightLb), 0),
    0,
  )
}

export function sortedByDateDesc(logs: WorkoutLog[]): WorkoutLog[] {
  return [...logs].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function logsInLastDays(logs: WorkoutLog[], days: number): WorkoutLog[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return logs.filter((l) => l.date >= cutoffStr)
}

export interface ExerciseHistoryPoint {
  date: string
  maxWeightLb: number
  volume: number
  bestSetReps: number
  durationMin: number
}

export function exerciseHistory(
  logs: WorkoutLog[],
  exerciseId: string,
): ExerciseHistoryPoint[] {
  const points: ExerciseHistoryPoint[] = []
  for (const log of sortedByDateDesc(logs).reverse()) {
    const entry = log.exercises.find((e) => e.exerciseId === exerciseId)
    if (!entry || entry.sets.length === 0) continue
    let maxWeightLb = 0
    let bestSetReps = 0
    let volume = 0
    let durationMin = 0
    for (const set of entry.sets) {
      volume += setVolume(set.reps, set.weightLb)
      durationMin += set.durationMin ?? 0
      if ((set.weightLb ?? 0) > maxWeightLb) {
        maxWeightLb = set.weightLb ?? 0
        bestSetReps = set.reps ?? 0
      }
    }
    points.push({ date: log.date, maxWeightLb, volume, bestSetReps, durationMin })
  }
  return points
}

export function personalBest(
  logs: WorkoutLog[],
  exerciseId: string,
): ExerciseHistoryPoint | undefined {
  const history = exerciseHistory(logs, exerciseId)
  if (history.length === 0) return undefined
  return history.reduce((best, p) =>
    p.maxWeightLb > best.maxWeightLb ? p : best,
  )
}

export function longestDuration(
  logs: WorkoutLog[],
  exerciseId: string,
): ExerciseHistoryPoint | undefined {
  const history = exerciseHistory(logs, exerciseId)
  if (history.length === 0) return undefined
  return history.reduce((best, p) =>
    p.durationMin > best.durationMin ? p : best,
  )
}

// True for exercises tracked purely by time (e.g. cardio machines), where
// weight/reps-based stats like volume and personal-best weight don't apply.
export function isDurationBased(history: ExerciseHistoryPoint[]): boolean {
  const hasStrengthData = history.some(
    (h) => h.maxWeightLb > 0 || h.bestSetReps > 0,
  )
  const hasDurationData = history.some((h) => h.durationMin > 0)
  return hasDurationData && !hasStrengthData
}
