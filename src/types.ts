export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Legs'
  | 'Arms'
  | 'Core'
  | 'Full Body'
  | 'Cardio'

export type Equipment =
  | 'Bodyweight'
  | 'Barbell'
  | 'Dumbbell'
  | 'Kettlebell'
  | 'Machine'
  | 'Cable'
  | 'Bands'
  | 'Other'

export interface Exercise {
  id: string
  name: string
  category: MuscleGroup
  equipment: Equipment
  instructions: string[]
  tips: string[]
  custom?: boolean
}

export interface SetEntry {
  reps?: number
  weightKg?: number
  durationSec?: number
}

export interface LoggedExercise {
  exerciseId: string
  sets: SetEntry[]
}

export interface WorkoutLog {
  id: string
  date: string // ISO date string (yyyy-mm-dd)
  createdAt: string // ISO timestamp
  name: string
  programId?: string
  programDayId?: string
  exercises: LoggedExercise[]
  notes?: string
}

export interface ProgramExercise {
  exerciseId: string
  targetSets: number
  targetReps: string // e.g. "8-12" or "AMRAP"
}

export interface ProgramDay {
  id: string
  name: string
  exercises: ProgramExercise[]
}

export interface Program {
  id: string
  name: string
  description: string
  days: ProgramDay[]
}
