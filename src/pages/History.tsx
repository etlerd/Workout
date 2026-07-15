import { Link } from 'react-router-dom'
import { useExercises, useLogs } from '../data/repo'
import Card from '../components/Card'
import { logVolume, sortedByDateDesc } from '../utils/stats'
import { parseLocalDate } from '../utils/date'

export default function History() {
  const logs = useLogs()
  const exercises = useExercises()
  const exerciseById = new Map(exercises.map((e) => [e.id, e]))
  const sorted = sortedByDateDesc(logs)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Workout History</h1>
        <Link
          to="/log"
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
        >
          + Log Workout
        </Link>
      </div>

      {sorted.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-12">
          No workouts logged yet.{' '}
          <Link to="/log" className="text-emerald-400">
            Log your first one
          </Link>
          .
        </p>
      )}

      <div className="space-y-3">
        {sorted.map((log) => (
          <Link key={log.id} to={`/log/${log.id}`}>
            <Card className="hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-medium text-white">{log.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {parseLocalDate(log.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {log.exercises.length} exercise
                  {log.exercises.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                {log.exercises.slice(0, 5).map((ex) => (
                  <span
                    key={ex.exerciseId}
                    className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded-full"
                  >
                    {exerciseById.get(ex.exerciseId)?.name ?? 'Unknown'}
                  </span>
                ))}
              </div>
              {logVolume(log) > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Volume: {logVolume(log).toLocaleString()} lbs
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
