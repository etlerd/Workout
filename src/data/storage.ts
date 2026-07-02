const PREFIX = 'workout-tracker:'

export function loadList<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T[]
  } catch {
    return fallback
  }
}

export function saveList<T>(key: string, value: T[]): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function newId(): string {
  return crypto.randomUUID()
}
