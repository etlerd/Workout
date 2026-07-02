import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteProgram, useExercises, usePrograms } from '../data/repo'
import Card from '../components/Card'

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const programs = usePrograms()
  const exercises = useExercises()
  const navigate = useNavigate()
  const program = programs.find((p) => p.id === id)
  const exerciseById = new Map(exercises.map((e) => [e.id, e]))

  if (!program) {
    return (
      <div className="text-center py-12 text-gray-500">
        Program not found.{' '}
        <Link to="/programs" className="text-emerald-400">
          Back to programs
        </Link>
      </div>
    )
  }

  function handleDelete() {
    if (!program) return
    deleteProgram(program.id)
    navigate('/programs')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <Link to="/programs" className="text-sm text-gray-400 hover:text-gray-200">
        ← Back to programs
      </Link>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-white">{program.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{program.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            to={`/programs/${program.id}/edit`}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-white/15 text-gray-300 hover:bg-white/5"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {program.days.map((day) => (
          <Card key={day.id}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-white">{day.name}</h2>
              <Link
                to="/log"
                state={{ programId: program.id, dayId: day.id }}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                Start Workout
              </Link>
            </div>
            <ul className="space-y-1">
              {day.exercises.map((pe, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm text-gray-300 py-1"
                >
                  <span>{exerciseById.get(pe.exerciseId)?.name ?? 'Unknown'}</span>
                  <span className="text-gray-500">
                    {pe.targetSets} × {pe.targetReps}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
