import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  addWorkoutLog,
  deleteWorkoutLog,
  updateProgramExerciseTarget,
  updateWorkoutLog,
  useExercises,
  useLogs,
  usePrograms,
} from '../data/repo'
import Card from '../components/Card'
import ExercisePicker from '../components/ExercisePicker'
import EmojiConfetti from '../components/EmojiConfetti'
import type {
  Exercise,
  LoggedExercise,
  Program,
  ProgramDay,
  ProgramExercise,
  SetEntry,
  WorkoutLog,
} from '../types'
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
  saved: boolean
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

function setsFromLogged(sets: SetEntry[]): EditableSet[] {
  return sets.length
    ? sets.map((s) => ({
        reps: s.reps?.toString() ?? '',
        weightLb: s.weightLb?.toString() ?? '',
        durationMin: s.durationMin?.toString() ?? '',
      }))
    : [emptySet()]
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function itemsForDay(day: ProgramDay): EditableExercise[] {
  return day.exercises.map((pe) => ({
    exerciseId: pe.exerciseId,
    saved: false,
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

function formatValueRange(values: number[]): string {
  const min = Math.min(...values)
  const max = Math.max(...values)
  return min === max ? String(min) : `${min}-${max}`
}

function deriveTargets(
  sets: EditableSet[],
): Partial<Pick<ProgramExercise, 'targetSets' | 'targetReps' | 'targetWeight'>> {
  const repsValues = sets.map((s) => s.reps).filter(Boolean).map(Number)
  const weightValues = sets.map((s) => s.weightLb).filter(Boolean).map(Number)
  const updates: Partial<
    Pick<ProgramExercise, 'targetSets' | 'targetReps' | 'targetWeight'>
  > = { targetSets: sets.length }
  if (repsValues.length > 0) updates.targetReps = formatValueRange(repsValues)
  if (weightValues.length > 0) {
    updates.targetWeight = `${formatValueRange(weightValues)} lbs`
  }
  return updates
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

  const [selectedProgramId, setSelectedProgramId] = useState<string>(() => {
    if (existingLog) return existingLog.programId ?? ''
    if (navPrefill) return navPrefill.programId
    return mostRecentLogSelection(logs).programId
  })
  const [selectedDayId, setSelectedDayId] = useState<string>(() => {
    if (existingLog) return existingLog.programDayId ?? ''
    if (navPrefill) return navPrefill.dayId
    return mostRecentLogSelection(logs).dayId
  })

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
  const [logRecordId, setLogRecordId] = useState<string | undefined>(
    existingLog?.id,
  )
  const persistedExercisesRef = useRef<LoggedExercise[]>(
    existingLog?.exercises ?? [],
  )
  const [pickerOpen, setPickerOpen] = useState(false)
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
      { exerciseId: exercise.id, sets: [emptySet()], saved: false },
    ])
    setPickerOpen(false)
  }

  function persistExercises(nextExercises: LoggedExercise[]) {
    persistedExercisesRef.current = nextExercises
    const payload = {
      date,
      name: name.trim() || 'Workout',
      notes: notes.trim() || undefined,
      programId: selectedProgramId || undefined,
      programDayId: selectedDayId || undefined,
      exercises: nextExercises,
    }
    if (logRecordId) {
      updateWorkoutLog(logRecordId, payload)
    } else {
      const newId = addWorkoutLog(payload)
      setLogRecordId(newId)
      navigate(`/log/${newId}`, { replace: true })
    }
  }

  function saveExerciseCard(index: number) {
    const item = items[index]
    const persistedSets: SetEntry[] = item.sets
      .filter((s) => s.reps || s.weightLb || s.durationMin)
      .map((s) => ({
        reps: s.reps ? Number(s.reps) : undefined,
        weightLb: s.weightLb ? Number(s.weightLb) : undefined,
        durationMin: s.durationMin ? Number(s.durationMin) : undefined,
      }))
    if (persistedSets.length === 0) return

    const nextExercises = [
      ...persistedExercisesRef.current.filter(
        (e) => e.exerciseId !== item.exerciseId,
      ),
      { exerciseId: item.exerciseId, sets: persistedSets },
    ]
    persistExercises(nextExercises)

    const day = selectedProgram?.days.find((d) => d.id === selectedDayId)
    const isProgramExercise = day?.exercises.some(
      (pe) => pe.exerciseId === item.exerciseId,
    )
    if (selectedProgramId && selectedDayId && isProgramExercise) {
      updateProgramExerciseTarget(
        selectedProgramId,
        selectedDayId,
        item.exerciseId,
        deriveTargets(item.sets),
      )
    }

    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, saved: true } : it)),
    )
  }

  function editExercise(index: number) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, saved: false } : it)),
    )
  }

  function removeExercise(index: number) {
    const item = items[index]
    if (item.saved) {
      const nextExercises = persistedExercisesRef.current.filter(
        (e) => e.exerciseId !== item.exerciseId,
      )
      persistExercises(nextExercises)
    }
    setItems((prev) => prev.filter((_, i) => i !== index))
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

  function finishWorkout() {
    if (!logRecordId) return
    persistExercises(persistedExercisesRef.current)
    setShowCelebration(true)
    setTimeout(() => navigate('/history'), CELEBRATION_DELAY_MS)
  }

  function handleDelete() {
    if (logRecordId) {
      deleteWorkoutLog(logRecordId)
      navigate('/history')
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-white">Log Workout</h1>

      {!logRecordId && (
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
          const hasData = item.sets.some(
            (s) => s.reps || s.weightLb || s.durationMin,
          )
          return (
            <Card
              key={exIndex}
              className={item.saved ? 'opacity-60' : undefined}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
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
                </div>
                <button
                  onClick={() => removeExercise(exIndex)}
                  className="text-xs text-gray-500 hover:text-red-400 shrink-0"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-1.5">
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
                      disabled={item.saved}
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'reps', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                    />
                    <input
                      inputMode="decimal"
                      disabled={item.saved}
                      value={set.weightLb}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'weightLb', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                    />
                    <input
                      inputMode="decimal"
                      disabled={item.saved}
                      value={set.durationMin}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, 'durationMin', e.target.value)
                      }
                      className="w-full min-w-0 rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                    />
                    {!item.saved && (
                      <button
                        onClick={() => removeSet(exIndex, setIndex)}
                        className="text-gray-500 hover:text-red-400 text-sm"
                        aria-label="Remove set"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {item.saved ? (
                <p className="mt-3 text-xs text-emerald-400 flex items-center gap-2">
                  ✓ Saved
                  <button
                    onClick={() => editExercise(exIndex)}
                    className="text-gray-400 hover:text-white underline"
                  >
                    Edit
                  </button>
                </p>
              ) : (
                <>
                  <button
                    onClick={() => addSet(exIndex)}
                    className="mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    + Add Set
                  </button>
                  <button
                    onClick={() => saveExerciseCard(exIndex)}
                    disabled={!hasData}
                    className="mt-3 w-full py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save Exercise
                  </button>
                </>
              )}
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
          onClick={finishWorkout}
          disabled={!logRecordId || showCelebration}
          className="px-4 py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {showCelebration ? 'Saved!' : 'Finish Workout'}
        </button>
        {logRecordId && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      {!logRecordId && (
        <p className="text-xs text-gray-500">
          Save at least one exercise above to finish this workout.
        </p>
      )}

      {pickerOpen && (
        <ExercisePicker onPick={addExercise} onClose={() => setPickerOpen(false)} />
      )}

      {showCelebration && <EmojiConfetti />}
    </div>
  )
}

function buildInitialItems(
  existingLog: WorkoutLog | undefined,
  programs: Program[],
  programId: string,
  dayId: string,
): EditableExercise[] {
  const program = programs.find((p) => p.id === programId)
  const day = program?.days.find((d) => d.id === dayId)
  const templateItems = day ? itemsForDay(day) : []

  if (!existingLog) return templateItems

  const loggedByExerciseId = new Map(
    existingLog.exercises.map((e) => [e.exerciseId, e]),
  )

  const overlaid = templateItems.map((item) => {
    const logged = loggedByExerciseId.get(item.exerciseId)
    return logged
      ? { ...item, saved: true, sets: setsFromLogged(logged.sets) }
      : item
  })

  const templateIds = new Set(templateItems.map((i) => i.exerciseId))
  const extras: EditableExercise[] = existingLog.exercises
    .filter((e) => !templateIds.has(e.exerciseId))
    .map((e) => ({
      exerciseId: e.exerciseId,
      saved: true,
      sets: setsFromLogged(e.sets),
    }))

  return [...overlaid, ...extras]
}
