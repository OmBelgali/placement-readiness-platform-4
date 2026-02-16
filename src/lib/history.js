const STORAGE_KEY = "placement_readiness_history"
import { normalizeEntry, computeFinalScore } from "./schema"

function ensureEntry(entry) {
  const normalized = normalizeEntry(entry)
  if (!normalized) return { ok: false, error: "corrupted" }
  return { ok: true, entry: normalized }
}

export function saveAnalysis(entry) {
  const base = {
    id: entry.id || crypto.randomUUID(),
    createdAt: entry.createdAt || new Date().toISOString(),
    company: entry.company ?? "",
    role: entry.role ?? "",
    jdText: entry.jdText ?? "",
    extractedSkills: entry.extractedSkills ?? { coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: [] },
    roundMapping: entry.roundMapping ?? [],
    checklist: entry.checklist ?? [],
    plan7Days: entry.plan7Days ?? entry.plan ?? [],
    questions: entry.questions ?? [],
    baseScore: entry.baseScore ?? entry.readinessScore ?? 0,
    skillConfidenceMap: entry.skillConfidenceMap ?? {},
    finalScore: entry.finalScore ?? computeFinalScore(entry.baseScore ?? entry.readinessScore ?? 0, entry.skillConfidenceMap ?? {}),
    updatedAt: new Date().toISOString(),
    companyIntel: entry.companyIntel ?? null,
  }
  const list = getHistoryRaw()
  list.unshift(base)
  const trimmed = list.slice(0, 50)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  return base
}

function getHistoryRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getHistory() {
  const raw = getHistoryRaw()
  const out = []
  for (let i = 0; i < raw.length; i++) {
    const result = ensureEntry(raw[i])
    if (result.ok) {
      out.push(result.entry)
    }
  }
  return out
}

export function getHistoryWithErrors() {
  const raw = getHistoryRaw()
  const out = []
  let corruptedCount = 0
  for (let i = 0; i < raw.length; i++) {
    const result = ensureEntry(raw[i])
    if (result.ok) {
      out.push(result.entry)
    } else {
      corruptedCount++
    }
  }
  return { entries: out, corruptedCount }
}

export function getEntryById(id) {
  const list = getHistory()
  return list.find((e) => e.id === id) ?? null
}

export function updateEntry(id, updates) {
  const list = getHistoryRaw()
  const idx = list.findIndex((e) => e && e.id === id)
  if (idx === -1) return null
  const current = list[idx]
  const base = current.baseScore ?? current.readinessScore ?? 0
  const merged = { ...current, ...updates }
  if ("skillConfidenceMap" in updates) {
    merged.finalScore = computeFinalScore(base, updates.skillConfidenceMap)
    merged.updatedAt = new Date().toISOString()
  }
  list[idx] = merged
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    return null
  }
  return normalizeEntry(merged)
}
