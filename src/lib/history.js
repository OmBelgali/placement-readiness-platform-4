const STORAGE_KEY = "placement_readiness_history"

export function saveAnalysis(entry) {
  const list = getHistory()
  const newEntry = { ...entry, id: entry.id || crypto.randomUUID(), createdAt: entry.createdAt || new Date().toISOString() }
  list.unshift(newEntry)
  const trimmed = list.slice(0, 50)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  return newEntry
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getEntryById(id) {
  return getHistory().find((e) => e.id === id)
}
