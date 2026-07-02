import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addCustomExercise, useExercises, useLogs } from '../data/repo'
import Card from '../components/Card'
import Badge from '../components/Badge'
import type { Equipment, MuscleGroup } from '../types'
import { exerciseHistory, personalBest } from '../utils/stats'

const categories: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
  'Full Body',
  'Cardio',
]
const equipmentOptions: Equipment[] = [
  'Bodyweight',
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Bands',
  'Other',
]

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  if (id === 'new') return <NewExerciseForm />
  return <ExerciseView id={id!} />
}

function ExerciseView({ id }: { id: string }) {
  const exercises = useExercises()
  const logs = useLogs()
  const exercise = exercises.find((e) => e.id === id)

  if (!exercise) {
    return (
      <div className="text-center py-12 text-gray-500">
        Exercise not found. <Link to="/exercises" className="text-emerald-400">Back to library</Link>
      </div>
    )
  }

  const best = personalBest(logs, id)
  const history = exerciseHistory(logs, id)

  return (
    <div className="space-y-4 max-w-2xl">
      <Link to="/exercises" className="text-sm text-gray-400 hover:text-gray-200">
        ← Back to library
      </Link>
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold text-white">{exercise.name}</h1>
      </div>
      <div className="flex gap-1.5">
        <Badge color="emerald">{exercise.category}</Badge>
        <Badge>{exercise.equipment}</Badge>
      </div>

      {best && (
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Personal Best</p>
          <p className="text-lg text-white font-medium mt-1">
            {best.maxWeightLb} lbs × {best.bestSetReps} reps
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(best.date).toLocaleDateString()} · logged {history.length} time
            {history.length === 1 ? '' : 's'}
          </p>
        </Card>
      )}

      <Card>
        <h2 className="font-medium text-white mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-300">
          {exercise.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Card>

      {exercise.tips.length > 0 && (
        <Card>
          <h2 className="font-medium text-white mb-2">Form Tips</h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
            {exercise.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

function NewExerciseForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<MuscleGroup>('Chest')
  const [equipment, setEquipment] = useState<Equipment>('Bodyweight')
  const [instructions, setInstructions] = useState('')
  const [tips, setTips] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addCustomExercise({
      name: name.trim(),
      category,
      equipment,
      instructions: instructions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      tips: tips
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    navigate('/exercises')
  }

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/exercises" className="text-sm text-gray-400 hover:text-gray-200">
        ← Back to library
      </Link>
      <h1 className="text-xl font-semibold text-white">Add Custom Exercise</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MuscleGroup)}
              className="w-full rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Equipment</label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as Equipment)}
              className="w-full rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {equipmentOptions.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Instructions (one step per line)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            className="w-full rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Form tips (one per line, optional)
          </label>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            rows={3}
            className="w-full rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors"
        >
          Save Exercise
        </button>
      </form>
    </div>
  )
}
