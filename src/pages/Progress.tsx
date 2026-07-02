import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useExercises, useLogs } from '../data/repo'
import Card from '../components/Card'
import { exerciseHistory } from '../utils/stats'

const ACCENT = '#34d399'
const GRID = '#2a2f3a'
const AXIS = '#8b93a1'

export default function Progress() {
  const exercises = useExercises()
  const logs = useLogs()

  const loggedExerciseIds = useMemo(() => {
    const ids = new Set<string>()
    logs.forEach((l) => l.exercises.forEach((e) => ids.add(e.exerciseId)))
    return ids
  }, [logs])

  const loggedExercises = exercises
    .filter((e) => loggedExerciseIds.has(e.id))
    .sort((a, b) => a.name.localeCompare(b.name))

  const [exerciseId, setExerciseId] = useState(loggedExercises[0]?.id ?? '')
  const selected = loggedExercises.find((e) => e.id === exerciseId)
  const history = exerciseId ? exerciseHistory(logs, exerciseId) : []

  const chartData = history.map((h) => ({
    date: new Date(h.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    weight: h.maxWeightKg,
    volume: h.volume,
  }))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Progress</h1>

      {loggedExercises.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">
          Log a few workouts to see your progress here.
        </p>
      ) : (
        <>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {loggedExercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          {selected && history.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Card>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Best Weight
                  </p>
                  <p className="text-xl text-white font-semibold mt-1">
                    {Math.max(...history.map((h) => h.maxWeightKg))} kg
                  </p>
                </Card>
                <Card>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Sessions
                  </p>
                  <p className="text-xl text-white font-semibold mt-1">
                    {history.length}
                  </p>
                </Card>
                <Card>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Latest Volume
                  </p>
                  <p className="text-xl text-white font-semibold mt-1">
                    {history[history.length - 1]?.volume.toLocaleString()} kg
                  </p>
                </Card>
              </div>

              <Card>
                <h2 className="text-sm font-medium text-gray-300 mb-3">
                  Max Weight Over Time
                </h2>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ left: -10 }}>
                      <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke={AXIS} fontSize={12} />
                      <YAxis stroke={AXIS} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: '#151922',
                          border: '1px solid #2a2f3a',
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                        labelStyle={{ color: '#e5e7eb' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke={ACCENT}
                        strokeWidth={2}
                        dot={{ r: 3, fill: ACCENT }}
                        name="Max weight (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h2 className="text-sm font-medium text-gray-300 mb-3">
                  Volume Over Time
                </h2>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ left: -10 }}>
                      <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke={AXIS} fontSize={12} />
                      <YAxis stroke={AXIS} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: '#151922',
                          border: '1px solid #2a2f3a',
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                        labelStyle={{ color: '#e5e7eb' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#38bdf8' }}
                        name="Volume (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}
