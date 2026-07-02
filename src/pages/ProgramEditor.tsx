import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addProgram, updateProgram, useExercises, usePrograms } from '../data/repo'
import { newId } from '../data/storage'
import Card from '../components/Card'
import ExercisePicker from '../components/ExercisePicker'
import type { Exercise, ProgramDay, ProgramExercise } from '../types'

export default function ProgramEditor() {
  const { id } = useParams<{ id: string }>()
  const programs = usePrograms()
  const exercises = useExercises()
  const navigate = useNavigate()
  const existing = id ? programs.find((p) => p.id === id) : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [days, setDays] = useState<ProgramDay[]>(
    existing?.days ?? [{ id: newId(), name: 'Day 1', exercises: [] }],
  )
  const [pickerForDay, setPickerForDay] = useState<number | null>(null)

  const exerciseById = new Map(exercises.map((e) => [e.id, e]))

  function addDay() {
    setDays((prev) => [
      ...prev,
      { id: newId(), name: `Day ${prev.length + 1}`, exercises: [] },
    ])
  }

  function removeDay(index: number) {
    setDays((prev) => prev.filter((_, i) => i !== index))
  }

  function updateDayName(index: number, dayName: string) {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, name: dayName } : d)),
    )
  }

  function addExerciseToDay(dayIndex: number, exercise: Exercise) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                { exerciseId: exercise.id, targetSets: 3, targetReps: '8-12' },
              ],
            }
          : d,
      ),
    )
    setPickerForDay(null)
  }

  function removeExerciseFromDay(dayIndex: number, exIndex: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? { ...d, exercises: d.exercises.filter((_, ei) => ei !== exIndex) }
          : d,
      ),
    )
  }

  function updateProgramExercise(
    dayIndex: number,
    exIndex: number,
    field: keyof ProgramExercise,
    value: string | number,
  ) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              exercises: d.exercises.map((pe, ei) =>
                ei === exIndex ? { ...pe, [field]: value } : pe,
              ),
            }
          : d,
      ),
    )
  }

  function handleSave() {
    const payload = {
      name: name.trim() || 'Untitled Program',
      description: description.trim(),
      days: days.filter((d) => d.exercises.length > 0),
    }
    if (existing) {
      updateProgram(existing.id, payload)
      navigate(`/programs/${existing.id}`)
    } else {
      addProgram(payload)
      navigate('/programs')
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-white">
        {existing ? 'Edit Program' : 'New Program'}
      </h1>

      <Card className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </Card>

      <div className="space-y-3">
        {days.map((day, dayIndex) => (
          <Card key={day.id}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <input
                value={day.name}
                onChange={(e) => updateDayName(dayIndex, e.target.value)}
                className="font-medium text-white bg-transparent border-b border-transparent focus:border-white/20 focus:outline-none flex-1"
              />
              <button
                onClick={() => removeDay(dayIndex)}
                className="text-xs text-gray-500 hover:text-red-400"
              >
                Remove Day
              </button>
            </div>

            <div className="space-y-2">
              {day.exercises.map((pe, exIndex) => (
                <div
                  key={exIndex}
                  className="grid grid-cols-[1fr_4rem_5rem_1.5rem] gap-2 items-center"
                >
                  <span className="text-sm text-gray-300 truncate">
                    {exerciseById.get(pe.exerciseId)?.name ?? 'Unknown'}
                  </span>
                  <input
                    inputMode="numeric"
                    value={pe.targetSets}
                    onChange={(e) =>
                      updateProgramExercise(
                        dayIndex,
                        exIndex,
                        'targetSets',
                        Number(e.target.value) || 0,
                      )
                    }
                    className="rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    value={pe.targetReps}
                    onChange={(e) =>
                      updateProgramExercise(
                        dayIndex,
                        exIndex,
                        'targetReps',
                        e.target.value,
                      )
                    }
                    className="rounded-md bg-[#0b0d12] border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => removeExerciseFromDay(dayIndex, exIndex)}
                    className="text-gray-500 hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPickerForDay(dayIndex)}
              className="mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              + Add Exercise
            </button>
          </Card>
        ))}
      </div>

      <button
        onClick={addDay}
        className="w-full py-2.5 rounded-md border border-dashed border-white/20 text-sm text-gray-400 hover:text-white hover:border-white/40 transition-colors"
      >
        + Add Day
      </button>

      <button
        onClick={handleSave}
        className="px-4 py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors"
      >
        Save Program
      </button>

      {pickerForDay !== null && (
        <ExercisePicker
          onPick={(ex) => addExerciseToDay(pickerForDay, ex)}
          onClose={() => setPickerForDay(null)}
        />
      )}
    </div>
  )
}
