import { useMemo, useState } from 'react'
import { useExercises } from '../data/repo'
import type { Exercise } from '../types'

export default function ExercisePicker({
  onPick,
  onClose,
}: {
  onPick: (exercise: Exercise) => void
  onClose: () => void
}) {
  const exercises = useExercises()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      exercises
        .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [exercises, query],
  )

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#151922] border border-white/10 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-white/10">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-md bg-[#0b0d12] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onPick(ex)}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 border-b border-white/5 flex items-center justify-between"
            >
              <span className="text-sm text-white">{ex.name}</span>
              <span className="text-xs text-gray-500">{ex.category}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">No matches</p>
          )}
        </div>
      </div>
    </div>
  )
}
