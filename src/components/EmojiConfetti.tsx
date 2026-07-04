import { useMemo, type CSSProperties } from 'react'

const EMOJIS = [
  '💪', '🏋️', '🏃', '🚴', '🤸', '🧘', '🔥', '⚡',
  '🏆', '🥇', '💯', '👏', '🙌', '❤️', '💧', '✅',
]

interface Particle {
  id: number
  emoji: string
  left: number
  delay: number
  duration: number
  size: number
  drift: number
}

type ParticleStyle = CSSProperties & { '--drift': string }

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.6 + Math.random() * 1.2,
    size: 1.25 + Math.random() * 1.25,
    drift: (Math.random() - 0.5) * 140,
  }))
}

export default function EmojiConfetti() {
  const particles = useMemo(() => makeParticles(48), [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {particles.map((p) => {
        const style: ParticleStyle = {
          left: `${p.left}%`,
          fontSize: `${p.size}rem`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          '--drift': `${p.drift}px`,
        }
        return (
          <span key={p.id} className="emoji-confetti-particle absolute top-0" style={style}>
            {p.emoji}
          </span>
        )
      })}
    </div>
  )
}
