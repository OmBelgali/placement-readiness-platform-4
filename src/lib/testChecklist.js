const STORAGE_KEY = "prp_test_checklist"

const DEFAULT_STATE = [
  { id: 1, label: "JD required validation works", checked: false, hint: "Submit Analyze form with empty JD — submit should be blocked." },
  { id: 2, label: "Short JD warning shows for <200 chars", checked: false, hint: "Paste JD under 200 chars on Analyze — warning message should appear." },
  { id: 3, label: "Skills extraction groups correctly", checked: false, hint: "Analyze JD with React, SQL — skills should appear grouped by category." },
  { id: 4, label: "Round mapping changes based on company + skills", checked: false, hint: "Try Amazon + DSA vs unknown + React — round mapping should differ." },
  { id: 5, label: "Score calculation is deterministic", checked: false, hint: "Same JD twice — base score should be identical." },
  { id: 6, label: "Skill toggles update score live", checked: false, hint: "On Results, toggle a skill — score updates immediately." },
  { id: 7, label: "Changes persist after refresh", checked: false, hint: "Toggle skills, refresh page — toggles and score should remain." },
  { id: 8, label: "History saves and loads correctly", checked: false, hint: "Analyze a JD, go to History — entry appears. Click to open Results." },
  { id: 9, label: "Export buttons copy the correct content", checked: false, hint: "Click Copy 7-day plan, paste elsewhere — content matches." },
  { id: 10, label: "No console errors on core pages", checked: false, hint: "Open /, /dashboard, /dashboard/analyze, /dashboard/results — no red errors in DevTools." },
]

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 10) return DEFAULT_STATE
    return parsed.map((item, i) => ({
      ...DEFAULT_STATE[i],
      ...item,
      id: item.id ?? DEFAULT_STATE[i].id,
      label: item.label ?? DEFAULT_STATE[i].label,
      hint: item.hint ?? DEFAULT_STATE[i].hint,
      checked: Boolean(item.checked),
    }))
  } catch {
    return DEFAULT_STATE
  }
}

export function setTestChecklistItem(id, checked) {
  const list = getTestChecklist()
  const idx = list.findIndex((item) => item.id === id)
  if (idx === -1) return list
  const next = list.map((item, i) => (i === idx ? { ...item, checked } : item))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function resetTestChecklist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE))
  return DEFAULT_STATE
}

export function areAllTestsPassed() {
  const list = getTestChecklist()
  return list.every((item) => item.checked)
}
