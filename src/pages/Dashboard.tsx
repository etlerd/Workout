import { Link } from 'react-router-dom'
import { useExercises, useLogs, usePrograms } from '../data/repo'
import Card from '../components/Card'
import { logsInLastDays, logVolume, sortedByDateDesc } from '../utils/stats'
import { parseLocalDate } from '../utils/date'

export default function Dashboard() {
  const logs = useLogs()
  const exercises = useExercises()
  const programs = usePrograms()
  const exerciseById = new Map(exercises.map((e) => [e.id, e]))

  const recent = sortedByDateDesc(logs).slice(0, 5)
  const thisWeek = logsInLastDays(logs, 7)
  const totalVolumeThisWeek = thisWeek.reduce((sum, l) => sum + logVolume(l), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's a snapshot of your training.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Total Workouts
          </p>
          <p className="text-2xl text-white font-semibold mt-1">{logs.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            This Week
          </p>
          <p className="text-2xl text-white font-semibold mt-1">
            {thisWeek.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Week Volume
          </p>
          <p className="text-2xl text-white font-semibold mt-1">
            {totalVolumeThisWeek.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">lbs</span>
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Programs
          </p>
          <p className="text-2xl text-white font-semibold mt-1">
            {programs.length}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/log"
          className="px-4 py-2 rounded-md bg-emerald-500 text-black font-medium text-sm hover:bg-emerald-400 transition-colors"
        >
          Log a Workout
        </Link>
        <Link
          to="/programs"
          className="px-4 py-2 rounded-md border border-white/15 text-gray-200 font-medium text-sm hover:bg-white/5 transition-colors"
        >
          Browse Programs
        </Link>
        <Link
          to="/exercises"
          className="px-4 py-2 rounded-md border border-white/15 text-gray-200 font-medium text-sm hover:bg-white/5 transition-colors"
        >
          Exercise Library
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-white">Recent Workouts</h2>
          {logs.length > 0 && (
            <Link to="/history" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-sm text-center py-4">
              No workouts logged yet.{' '}
              <Link to="/log" className="text-emerald-400">
                Get started
              </Link>
              .
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recent.map((log) => (
              <Link key={log.id} to={`/log/${log.id}`}>
                <Card className="hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{log.name}</p>
                      <p className="text-xs text-gray-500">
                        {log.exercises
                          .slice(0, 3)
                          .map((e) => exerciseById.get(e.exerciseId)?.name)
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {parseLocalDate(log.date).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
