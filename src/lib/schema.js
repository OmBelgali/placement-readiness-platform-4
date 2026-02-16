/**
 * Canonical Analysis Entry Schema
 * All history entries are normalized to this shape.
 */

const SKILL_KEYS = ["coreCS", "languages", "web", "data", "cloud", "testing", "other"]
const CATEGORY_LABELS = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web",
  data: "Data",
  cloud: "Cloud/DevOps",
  testing: "Testing",
  other: "Other",
}

function ensureArray(val) {
  return Array.isArray(val) ? val : []
}

function ensureObject(val) {
  return val && typeof val === "object" && !Array.isArray(val) ? val : {}
}

function ensureString(val, fallback = "") {
  return typeof val === "string" ? val : fallback
}

function ensureNumber(val, fallback = 0) {
  const n = Number(val)
  return Number.isFinite(n) ? n : fallback
}

export function normalizeExtractedSkills(raw) {
  const out = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  }
  if (!raw) return out

  if (raw.coreCS ?? raw.byCategory?.["Core CS"]) {
    out.coreCS = ensureArray(raw.coreCS ?? raw.byCategory?.["Core CS"])
  }
  if (raw.languages ?? raw.byCategory?.["Languages"]) {
    out.languages = ensureArray(raw.languages ?? raw.byCategory?.["Languages"])
  }
  if (raw.web ?? raw.byCategory?.["Web"]) {
    out.web = ensureArray(raw.web ?? raw.byCategory?.["Web"])
  }
  if (raw.data ?? raw.byCategory?.["Data"]) {
    out.data = ensureArray(raw.data ?? raw.byCategory?.["Data"])
  }
  if (raw.cloud ?? raw.byCategory?.["Cloud/DevOps"]) {
    out.cloud = ensureArray(raw.cloud ?? raw.byCategory?.["Cloud/DevOps"])
  }
  if (raw.testing ?? raw.byCategory?.["Testing"]) {
    out.testing = ensureArray(raw.testing ?? raw.byCategory?.["Testing"])
  }
  if (raw.other ?? raw.byCategory?.["Other"] ?? raw.byCategory?.["General"]) {
    out.other = ensureArray(raw.other ?? raw.byCategory?.["Other"] ?? raw.byCategory?.["General"])
  }

  const hasAny = SKILL_KEYS.some((k) => out[k].length > 0)
  if (!hasAny) {
    out.other = ["Communication", "Problem solving", "Basic coding", "Projects"]
  }

  return out
}

export function extractedToByCategory(extracted) {
  const byCategory = {}
  for (const key of SKILL_KEYS) {
    const label = CATEGORY_LABELS[key]
    const arr = ensureArray(extracted?.[key])
    if (arr.length > 0) byCategory[label] = arr
  }
  return byCategory
}

export function normalizeRoundMapping(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((r) => ({
    roundTitle: ensureString(r.roundTitle ?? r.round, `Round`),
    focusAreas: ensureArray(r.focusAreas),
    whyItMatters: ensureString(r.whyItMatters ?? r.why, ""),
  }))
}

export function normalizeChecklist(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((r) => ({
    roundTitle: ensureString(r.roundTitle ?? r.round, `Round`),
    items: ensureArray(r.items),
  }))
}

export function normalizePlan7Days(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((d) => ({
    day: ensureNumber(d.day, 0),
    focus: ensureString(d.focus ?? d.title, ""),
    tasks: ensureArray(d.tasks ?? d.items),
  }))
}

export function normalizeEntry(raw) {
  if (!raw || typeof raw !== "object") return null

  const id = ensureString(raw.id)
  if (!id) return null

  const extracted = normalizeExtractedSkills(raw.extractedSkills)
  const roundMapping = normalizeRoundMapping(raw.roundMapping)
  const checklist = normalizeChecklist(raw.checklist)
  const plan7Days = normalizePlan7Days(raw.plan7Days ?? raw.plan)
  const questions = ensureArray(raw.questions)
  const baseScore = ensureNumber(raw.baseScore ?? raw.readinessScore, 0)
  const skillConfidenceMap = ensureObject(raw.skillConfidenceMap)
  const finalScore = ensureNumber(
    raw.finalScore,
    computeFinalScore(baseScore, skillConfidenceMap)
  )

  return {
    id,
    createdAt: ensureString(raw.createdAt, new Date().toISOString()),
    company: ensureString(raw.company, ""),
    role: ensureString(raw.role, ""),
    jdText: ensureString(raw.jdText, ""),
    extractedSkills: extracted,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: ensureString(raw.updatedAt, raw.createdAt ?? new Date().toISOString()),
    companyIntel: raw.companyIntel ?? null,
  }
}

export function computeFinalScore(baseScore, skillConfidenceMap) {
  let delta = 0
  for (const v of Object.values(skillConfidenceMap || {})) {
    delta += v === "know" ? 2 : -2
  }
  return Math.max(0, Math.min(100, baseScore + delta))
}
