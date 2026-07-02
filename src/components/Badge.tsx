export default function Badge({
  children,
  color = 'gray',
}: {
  children: string
  color?: 'gray' | 'emerald' | 'sky' | 'amber'
}) {
  const colors: Record<string, string> = {
    gray: 'bg-white/10 text-gray-300',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    sky: 'bg-sky-500/15 text-sky-400',
    amber: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}
