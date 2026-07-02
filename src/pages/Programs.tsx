import { Link } from 'react-router-dom'
import { usePrograms } from '../data/repo'
import Card from '../components/Card'

export default function Programs() {
  const programs = usePrograms()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Programs</h1>
        <Link
          to="/programs/new"
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
        >
          + New Program
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {programs.map((program) => (
          <Link key={program.id} to={`/programs/${program.id}`}>
            <Card className="h-full hover:border-emerald-500/40 transition-colors">
              <h2 className="font-medium text-white">{program.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{program.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {program.days.length} day{program.days.length === 1 ? '' : 's'}
              </p>
            </Card>
          </Link>
        ))}
        {programs.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full text-center py-8">
            No programs yet.
          </p>
        )}
      </div>
    </div>
  )
}
