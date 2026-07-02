import type { WorkoutLog } from '../types'

export function setVolume(reps?: number, weightKg?: number): number {
  if (!reps || !weightKg) return 0
  return reps * weightKg
}

export function logVolume(log: WorkoutLog): number {
  return log.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.reduce((s, set) => s + setVolume(set.reps, set.weightKg), 0),
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
  maxWeightKg: number
  volume: number
  bestSetReps: number
}

export function exerciseHistory(
  logs: WorkoutLog[],
  exerciseId: string,
): ExerciseHistoryPoint[] {
  const points: ExerciseHistoryPoint[] = []
  for (const log of sortedByDateDesc(logs).reverse()) {
    const entry = log.exercises.find((e) => e.exerciseId === exerciseId)
    if (!entry || entry.sets.length === 0) continue
    let maxWeightKg = 0
    let bestSetReps = 0
    let volume = 0
    for (const set of entry.sets) {
      volume += setVolume(set.reps, set.weightKg)
      if ((set.weightKg ?? 0) > maxWeightKg) {
        maxWeightKg = set.weightKg ?? 0
        bestSetReps = set.reps ?? 0
      }
    }
    points.push({ date: log.date, maxWeightKg, volume, bestSetReps })
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
    p.maxWeightKg > best.maxWeightKg ? p : best,
  )
}
