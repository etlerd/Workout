import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExercises } from '../data/repo'
import Card from '../components/Card'
import Badge from '../components/Badge'
import type { MuscleGroup } from '../types'

const categories: (MuscleGroup | 'All')[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
  'Full Body',
  'Cardio',
]

export default function Exercises() {
  const exercises = useExercises()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<MuscleGroup | 'All'>('All')

  const filtered = useMemo(() => {
    return exercises
      .filter((e) => category === 'All' || e.category === category)
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [exercises, query, category])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white">Exercise Library</h1>
        <Link
          to="/exercises/new"
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
        >
          + Add Exercise
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises..."
          className="flex-1 rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MuscleGroup | 'All')}
          className="rounded-md bg-[#151922] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((ex) => (
          <Link key={ex.id} to={`/exercises/${ex.id}`}>
            <Card className="h-full hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium text-white">{ex.name}</h2>
              </div>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                <Badge color="emerald">{ex.category}</Badge>
                <Badge>{ex.equipment}</Badge>
              </div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full text-center py-8">
            No exercises match your search.
          </p>
        )}
      </div>
    </div>
  )
}
