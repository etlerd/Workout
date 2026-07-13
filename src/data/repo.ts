import { useSyncExternalStore } from 'react'
import type { Exercise, Program, ProgramExercise, WorkoutLog } from '../types'
import { loadList, newId, saveList } from './storage'
import { seedExercises } from './seedExercises'
import { seedPrograms } from './seedPrograms'

function mergeMissingSeedItems<T extends { id: string }>(
  existing: T[],
  seed: T[],
): T[] {
  const existingIds = new Set(existing.map((item) => item.id))
  const missing = seed.filter((item) => !existingIds.has(item.id))
  return missing.length > 0 ? [...existing, ...missing] : existing
}

function createCollection<T extends { id: string }>(key: string, seed: T[]) {
  let items = mergeMissingSeedItems(loadList<T>(key, seed), seed)
  const listeners = new Set<() => void>()

  function persist() {
    saveList(key, items)
    listeners.forEach((l) => l())
  }

  return {
    getAll(): T[] {
      return items
    },
    set(next: T[]) {
      items = next
      persist()
    },
    add(item: T) {
      items = [...items, item]
      persist()
    },
    update(id: string, updater: (item: T) => T) {
      items = items.map((i) => (i.id === id ? updater(i) : i))
      persist()
    },
    remove(id: string) {
      items = items.filter((i) => i.id !== id)
      persist()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const exercisesCollection = createCollection<Exercise>(
  'exercises',
  seedExercises,
)
export const logsCollection = createCollection<WorkoutLog>('logs', [])
export const programsCollection = createCollection<Program>(
  'programs',
  seedPrograms,
)

export function useExercises(): Exercise[] {
  return useSyncExternalStore(exercisesCollection.subscribe, () =>
    exercisesCollection.getAll(),
  )
}

export function useLogs(): WorkoutLog[] {
  return useSyncExternalStore(logsCollection.subscribe, () =>
    logsCollection.getAll(),
  )
}

export function usePrograms(): Program[] {
  return useSyncExternalStore(programsCollection.subscribe, () =>
    programsCollection.getAll(),
  )
}

export function addWorkoutLog(log: Omit<WorkoutLog, 'id' | 'createdAt'>): string {
  const id = newId()
  logsCollection.add({ ...log, id, createdAt: new Date().toISOString() })
  return id
}

export function updateWorkoutLog(id: string, log: Omit<WorkoutLog, 'id' | 'createdAt'>) {
  logsCollection.update(id, (existing) => ({ ...log, id, createdAt: existing.createdAt }))
}

export function deleteWorkoutLog(id: string) {
  logsCollection.remove(id)
}

export function addCustomExercise(exercise: Omit<Exercise, 'id' | 'custom'>) {
  exercisesCollection.add({ ...exercise, id: newId(), custom: true })
}

export function addProgram(program: Omit<Program, 'id'>) {
  programsCollection.add({ ...program, id: newId() })
}

export function updateProgram(id: string, program: Omit<Program, 'id'>) {
  programsCollection.update(id, () => ({ ...program, id }))
}

export function deleteProgram(id: string) {
  programsCollection.remove(id)
}

export function updateProgramExerciseTarget(
  programId: string,
  dayId: string,
  exerciseId: string,
  updates: Partial<Pick<ProgramExercise, 'targetSets' | 'targetReps' | 'targetWeight'>>,
) {
  programsCollection.update(programId, (program) => ({
    ...program,
    days: program.days.map((day) =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map((pe) =>
              pe.exerciseId === exerciseId ? { ...pe, ...updates } : pe,
            ),
          }
        : day,
    ),
  }))
}
