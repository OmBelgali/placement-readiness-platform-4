import { areAllTestsPassed } from "./testChecklist"

const SUBMISSION_KEY = "prp_final_submission"
const STEPS_KEY = "prp_proof_steps"

const STEP_LABELS = [
  "Landing Page",
  "Dashboard Shell",
  "JD Analysis Flow",
  "Results & Skills",
  "Company Intel & Round Mapping",
  "Interactive Features (toggles, export)",
  "History",
  "Test Checklist & Ship",
]

export function isValidUrl(str) {
  if (!str || typeof str !== "string") return false
  const trimmed = str.trim()
  if (!trimmed) return false
  try {
    const u = new URL(trimmed)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function getProofSteps() {
  try {
    const raw = localStorage.getItem(STEPS_KEY)
    if (!raw) return STEP_LABELS.map((label, i) => ({ id: i + 1, label, completed: false }))
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 8) {
      return STEP_LABELS.map((label, i) => ({ id: i + 1, label, completed: Boolean(parsed?.[i]) }))
    }
    return STEP_LABELS.map((label, i) => ({
      id: i + 1,
      label,
      completed: Boolean(parsed[i]),
    }))
  } catch {
    return STEP_LABELS.map((label, i) => ({ id: i + 1, label, completed: false }))
  }
}

export function setProofStep(id, completed) {
  const steps = getProofSteps()
  const idx = steps.findIndex((s) => s.id === id)
  if (idx === -1) return steps
  steps[idx] = { ...steps[idx], completed }
  localStorage.setItem(STEPS_KEY, JSON.stringify(steps.map((s) => s.completed)))
  return steps
}

export function getFinalSubmission() {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY)
    if (!raw) return { lovableLink: "", githubLink: "", deployedLink: "" }
    const parsed = JSON.parse(raw)
    return {
      lovableLink: String(parsed.lovableLink ?? "").trim(),
      githubLink: String(parsed.githubLink ?? "").trim(),
      deployedLink: String(parsed.deployedLink ?? "").trim(),
    }
  } catch {
    return { lovableLink: "", githubLink: "", deployedLink: "" }
  }
}

export function setFinalSubmission(links) {
  const data = {
    lovableLink: String(links.lovableLink ?? "").trim(),
    githubLink: String(links.githubLink ?? "").trim(),
    deployedLink: String(links.deployedLink ?? "").trim(),
  }
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(data))
  return data
}

export function allProofLinksProvided() {
  const { lovableLink, githubLink, deployedLink } = getFinalSubmission()
  return isValidUrl(lovableLink) && isValidUrl(githubLink) && isValidUrl(deployedLink)
}

export function allStepsCompleted() {
  const steps = getProofSteps()
  return steps.every((s) => s.completed)
}

export function isShippedStatus() {
  return (
    allStepsCompleted() &&
    areAllTestsPassed() &&
    allProofLinksProvided()
  )
}
