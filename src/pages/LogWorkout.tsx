import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  addWorkoutLog,
  deleteWorkoutLog,
  updateWorkoutLog,
  useExercises,
  useLogs,
  usePrograms,
} from '../data/repo'
import Card from '../components/Card'
import ExercisePicker from '../components/ExercisePicker'
import EmojiConfetti from '../components/EmojiConfetti'
import type { Exercise, Program, ProgramDay, WorkoutLog } from '../types'
import { parseTargetReps, parseTargetWeight } from '../utils/targetParsing'

const CELEBRATION_DELAY_MS = 1400

interface EditableSet {
  reps: string
  weightLb: string
  durationMin: string
}

interface EditableExercise {
  exerciseId: string
  sets: EditableSet[]
  included: boolean
  targetReps?: string
  targetWeight?: string
}

function emptySet(): EditableSet {
  return { reps: '', weightLb: '', durationMin: '' }
}

function prefilledSet(targetReps?: string, targetWeight?: string): EditableSet {
  const { reps, durationMin } = parseTargetReps(targetReps)
  const weightLb = parseTargetWeight(targetWeight)
  return {
    reps: reps !== undefined ? String(reps) : '',
    weightLb: weightLb !== undefined ? String(weightLb) : '',
    durationMin: durationMin !== undefined ? String(durationMin) : '',
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function itemsForDay(day: ProgramDay): EditableExercise[] {
  return day.exercises.map((pe) => ({
    exerciseId: pe.exerciseId,
    included: false,
    sets: Array.from({ length: pe.targetSets || 1 }, () =>
      prefilledSet(pe.targetReps, pe.targetWeight),
    ),
    targetReps: pe.targetReps,
    targetWeight: pe.targetWeight,
  }))
}

function nameForDay(program: Program, day: ProgramDay): string {
  return `${program.name} — ${day.name}`
}

function mostRecentLogSelection(logs: WorkoutLog[]): {
  programId: string
  dayId: string
} {
  const mostRecent = [...logs].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  )[0]
  return {
    programId: mostRecent?.programId ?? '',
    dayId: mostRecent?.programDayId ?? '',
  }
}

export default function LogWorkout() {
  const { logId } = useParams<{ logId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const exercises = useExercises()
  const logs = useLogs()
  const programs = usePrograms()

  const existingLog = logId ? logs.find((l) => l.id === logId) : undefined
  const navPrefill = location.state as
    | { programId: string; dayId: string }
    | undefined

  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    () =>
      existingLog?.programId ??
      navPrefill?.programId ??
      mostRecentLogSelection(logs).programId,
  )
  const [selectedDayId, setSelectedDayId] = useState<string>(
    () =>
      existingLog?.programDayId ??
      navPrefill?.dayId ??
      mostRecentLogSelection(logs).dayId,
  )

  const [date, setDate] = useState(existingLog?.date ?? todayStr())
  const [name, setName] = useState(() => {
    if (existingLog) return existingLog.name
    const program = programs.find((p) => p.id === selectedProgramId)
    const day = program?.days.find((d) => d.id === selectedDayId)
    return program && day ? nameForDay(program, day) : ''
  })
  const [notes, setNotes] = useState(existingLog?.notes ?? '')
  const [items, setItems] = useState<EditableExercise[]>(() =>
    buildInitialItems(existingLog, programs, selectedProgramId, selectedDayId),
  )
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirmingSkips, setConfirmingSkips] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const exerciseById = useMemo(
    () => new Map(exercises.map((e) => [e.id, e])),
    [exercises],
  )

  const selectedProgram = programs.find((p) => p.id === selectedProgramId)

  function handleProgramChange(programId: string) {
    setSelectedProgramId(programId)
    const program = programs.find((p) => p.id === programId)
    const day = program?.days[0]
    setSelectedDayId(day?.id ?? '')
    if (program && day) {
      setItems(itemsForDay(day))
      setName(nameForDay(program, day))
    } else {
      setItems([])
      setName('')
    }
  }

  function handleDayChange(dayId: string) {
    setSelectedDayId(dayId)
    const day = selectedProgram?.days.find((d) => d.id === dayId)
    if (selectedProgram && day) {
      setItems(itemsForDay(day))
      setName(nameForDay(selectedProgram, day))
    }
  }

  function addExercise(exercise: Exercise) {
    setItems((prev) => [
      ...prev,
      { exerciseId: exercise.id, sets: [emptySet()], included: false },
    ])
    setPickerOpen(false)
  }

  function removeExercise(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleIncluded(index: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, included: !item.included } : item,
      ),
    )
  }

  function addSet(index: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, sets: [...item.sets, emptySet()] } : item,
      ),
    )
  }

  function removeSet(exIndex: number, setIndex: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === exIndex
          ? { ...item, sets: item.sets.filter((_, si) => si !== setIndex) }
          : item,
      ),
    )
  }

  function updateSet(
    exIndex: number,
    setIndex: number,
    field: keyof EditableSet,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === exIndex
          ? {
              ...item,
              sets: item.sets.map((s, si) =>
                si === setIndex ? { ...s, [field]: value } : s,
              ),
            }
          : item,
      ),
    )
  }

  const skippedItems = items.filter((item) => !item.included)

  function handleSaveClick() {
    if (skippedItems.length > 0) {
      setConfirmingSkips(true)
    } else {
      saveWorkout()
    }
  }

  function saveWorkout() {
    const payload = {
      date,
      name: name.trim() || 'Workout',
      notes: notes.trim() || undefined,
      programId: existingLog?.programId ?? (selectedProgramId || undefined),
      programDayId: existingLog?.programDayId ?? (selectedDayId || undefined),
      exercises: items
        .filter((item) => item.included && item.sets.length > 0)
        .map((item) => ({
          exerciseId: item.exerciseId,
          sets: item.sets
            .filter((s) => s.reps || s.weightLb || s.durationMin)
            .map((s) => ({
              reps: s.reps ? Number(s.reps) : undefined,
              weightLb: s.weightLb ? Number(s.weightLb) : undefined,
              durationMin: s.durationMin ? Number(s.durationMin) : undefined,
            })),
        }))
        .filter((item) => item.sets.length > 0),
    }

    if (existingLog) {
      updateWorkoutLog(existingLog.id, payload)
    } else {
      addWorkoutLog(payload)
    }
    setShowCelebration(true)
    setTimeout(() => navigate('/history'), CELEBRATION_DELAY_MS)
  }

  function handleDelete() {
    if (existingLog) {
      deleteWorkoutLog(existingLog.id)
      navigate('/history')
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-white">
        {existingLog ? 'Edit Workout' : 'Log Workout'}
      </h1>

      {!existingLog && (
        <Card className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Program</label>
              <select
                value={selectedProgramId}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Custom (no program)</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedProgram && selectedProgram.days.length > 0 && (
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Day</label>
                <select
                  value={selectedDayId}
                  onChange={(e) => handleDayChange(e.target.value)}
                  className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {selectedProgram.days.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((item, exIndex) => {
          const exercise = exerciseById.get(item.exerciseId)
          return (
            <Card key={exIndex}>
              <div className="flex items-start justify-between mb-2 gap-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.included}
                    onChange={() => toggleIncluded(exIndex)}
                    className="mt-1 accent-emerald-500 shrink-0"
                  />
                  <div>
                    <h3 className="font-medium text-white">
                      {exercise?.name ?? 'Unknown exercise'}
                    </h3>
                    {(item.targetReps || item.targetWeight) && (
                      <p className="text-xs text-emerald-400/80 mt-0.5">
                        Target: {item.targetReps}
                        {item.targetWeight ? ` · ${item.targetWeight}` : ''}
                      </p>
                    )}
                    {!item.included && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Not logged — check off if you did this one
                      </p>
                    )}
                  </div>
                </label>
                <button
                  onClick={() => removeExercise(exIndex)}
                  className="text-xs text-gray-500 hover:text-red-400 shrink-0"
                >
                  Remove
                </button>
              </div>
              <div className={`space-y-1.5 ${item.included ? '' : 'opacity-40'}`}>
                <div className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-2 text-xs text-gray-500 px-1">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Weight (lbs)</span>
                  <span>Duration (min)</span>
                  <span></span>
                </div>
                {item.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-2 items-center"
                  >
                    <span className="text-sm text-gray-400 text-center">
                      {setIndex + 1}
                    </span>
                    <input
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'reps', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      inputMode="decimal"
                      value={set.weightLb}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'weightLb', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      inputMode="decimal"
                      value={set.durationMin}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'durationMin', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => removeSet(exIndex, setIndex)}
                      className="text-gray-500 hover:text-red-400 text-sm"
                      aria-label="Remove set"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addSet(exIndex)}
                className="mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                + Add Set
              </button>
            </Card>
          )
        })}
      </div>

      <button
        onClick={() => setPickerOpen(true)}
        className="w-full py-2.5 rounded-md border border-dashed border-white/20 text-sm text-gray-400 hover:text-white hover:border-white/40 transition-colors"
      >
        + Add Exercise
      </button>

      <Card>
        <label className="block text-sm text-gray-400 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </Card>

      <div className="flex gap-3">
        <button
          onClick={handleSaveClick}
          disabled={items.length === 0 || showCelebration}
          className="px-4 py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {showCelebration ? 'Saved!' : 'Save Workout'}
        </button>
        {existingLog && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {pickerOpen && (
        <ExercisePicker onPick={addExercise} onClose={() => setPickerOpen(false)} />
      )}

      {showCelebration && <EmojiConfetti />}

      {confirmingSkips && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-30 p-4"
          onClick={() => setConfirmingSkips(false)}
        >
          <div
            className="bg-[#151922] border border-white/10 rounded-xl w-full max-w-sm p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-medium">Skip these exercises?</h2>
            <p className="text-sm text-gray-400">
              These won't be included when you save:
            </p>
            <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
              {skippedItems.map((item, i) => (
                <li key={i}>
                  {exerciseById.get(item.exerciseId)?.name ?? 'Unknown exercise'}
                </li>
              ))}
            </ul>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setConfirmingSkips(false)}
                className="px-3 py-1.5 rounded-md border border-white/15 text-sm text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmingSkips(false)
                  saveWorkout()
                }}
                className="px-3 py-1.5 rounded-md bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function buildInitialItems(
  existingLog: WorkoutLog | undefined,
  programs: Program[],
  programId: string,
  dayId: string,
): EditableExercise[] {
  if (existingLog) {
    return existingLog.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      included: true,
      sets: ex.sets.length
        ? ex.sets.map((s) => ({
            reps: s.reps?.toString() ?? '',
            weightLb: s.weightLb?.toString() ?? '',
            durationMin: s.durationMin?.toString() ?? '',
          }))
        : [emptySet()],
    }))
  }
  const program = programs.find((p) => p.id === programId)
  const day = program?.days.find((d) => d.id === dayId)
  return day ? itemsForDay(day) : []
}
