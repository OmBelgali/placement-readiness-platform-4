import { useMemo, useState, useEffect, useCallback } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getEntryById, getHistory, updateEntry } from "@/lib/history"
import { extractedToByCategory } from "@/lib/schema"
import { ChevronLeft, Copy, Download } from "lucide-react"

function CircularScore({ value }) {
  const size = 140
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - value / 100)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute">
        <span className="text-3xl font-bold text-gray-900">{Math.round(value)}</span>
      </div>
    </div>
  )
}

function getAllSkills(extractedSkills) {
  const byCat = extractedToByCategory(extractedSkills)
  return Object.entries(byCat).flatMap(([cat, skills]) =>
    (Array.isArray(skills) ? skills : []).map((s) => ({ skill: s, category: cat }))
  )
}

function computeLiveScore(baseScore, skillConfidenceMap) {
  let delta = 0
  for (const val of Object.values(skillConfidenceMap)) {
    delta += val === "know" ? 2 : -2
  }
  return Math.max(0, Math.min(100, baseScore + delta))
}

function formatPlanAsText(plan) {
  if (!plan?.length) return ""
  return plan
    .map(
      (d) =>
        `Day ${d.day}: ${d.focus ?? d.title ?? ""}\n${(d.tasks ?? d.items ?? []).map((i) => `  • ${i}`).join("\n")}`
    )
    .join("\n\n")
}

function formatChecklistAsText(checklist) {
  if (!checklist?.length) return ""
  return checklist
    .map(
      (r) =>
        `${r.roundTitle ?? r.round ?? ""}\n${(r.items || []).map((i) => `  • ${i}`).join("\n")}`
    )
    .join("\n\n")
}

function formatQuestionsAsText(questions) {
  if (!questions?.length) return ""
  return questions.map((q, i) => `${i + 1}. ${q}`).join("\n")
}

export default function Results() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")

  const entry = useMemo(() => {
    if (id) return getEntryById(id)
    const history = getHistory()
    return history[0] || null
  }, [id])

  const allSkills = useMemo(() => getAllSkills(entry?.extractedSkills || {}), [entry?.extractedSkills])

  const [skillConfidenceMap, setSkillConfidenceMap] = useState(() => {
    const map = {}
    allSkills.forEach(({ skill }) => {
      map[skill] = entry?.skillConfidenceMap?.[skill] ?? "practice"
    })
    return map
  })

  useEffect(() => {
    const map = {}
    allSkills.forEach(({ skill }) => {
      map[skill] = entry?.skillConfidenceMap?.[skill] ?? "practice"
    })
    setSkillConfidenceMap(map)
  }, [entry?.id, allSkills, entry?.skillConfidenceMap])

  const baseScore = entry?.baseScore ?? entry?.readinessScore ?? 0
  const liveScore = useMemo(
    () => computeLiveScore(baseScore, skillConfidenceMap),
    [baseScore, skillConfidenceMap]
  )

  const handleToggleSkill = useCallback(
    (skill) => {
      const next = skillConfidenceMap[skill] === "know" ? "practice" : "know"
      const nextMap = { ...skillConfidenceMap, [skill]: next }
      setSkillConfidenceMap(nextMap)
      if (entry?.id) {
        updateEntry(entry.id, { skillConfidenceMap: nextMap })
      }
    },
    [entry?.id, skillConfidenceMap]
  )

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  const [copyFeedback, setCopyFeedback] = useState(null)

  const handleCopyPlan = useCallback(async () => {
    const ok = await copyToClipboard(formatPlanAsText(entry?.plan7Days ?? entry?.plan))
    setCopyFeedback(ok ? "plan" : null)
    if (ok) setTimeout(() => setCopyFeedback(null), 1500)
  }, [entry?.plan7Days, entry?.plan, copyToClipboard])

  const handleCopyChecklist = useCallback(async () => {
    const ok = await copyToClipboard(formatChecklistAsText(entry?.checklist))
    setCopyFeedback(ok ? "checklist" : null)
    if (ok) setTimeout(() => setCopyFeedback(null), 1500)
  }, [entry?.checklist, copyToClipboard])

  const handleCopyQuestions = useCallback(async () => {
    const ok = await copyToClipboard(formatQuestionsAsText(entry?.questions))
    setCopyFeedback(ok ? "questions" : null)
    if (ok) setTimeout(() => setCopyFeedback(null), 1500)
  }, [entry?.questions, copyToClipboard])

  const handleDownloadTxt = useCallback(() => {
    const plan = entry?.plan7Days ?? entry?.plan
    const sections = [
      `Placement Readiness — ${entry?.company || "Company"} — ${entry?.role || "Role"}\n${"=".repeat(50)}`,
      `\n7-DAY PLAN\n${"-".repeat(20)}\n${formatPlanAsText(plan)}`,
      `\n\nROUND-WISE CHECKLIST\n${"-".repeat(20)}\n${formatChecklistAsText(entry?.checklist)}`,
      `\n\n10 LIKELY INTERVIEW QUESTIONS\n${"-".repeat(30)}\n${formatQuestionsAsText(entry?.questions)}`,
    ]
    const blob = new Blob([sections.join("")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `placement-prep-${(entry?.company || "export").replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [entry])

  const weakSkills = useMemo(() => {
    return allSkills
      .filter(({ skill }) => skillConfidenceMap[skill] === "practice")
      .slice(0, 3)
      .map(({ skill }) => skill)
  }, [allSkills, skillConfidenceMap])

  if (!entry) {
    return (
      <div className="space-y-6">
        <Link to="/dashboard/analyze">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No analysis found. Analyze a job description first.</p>
            <Link to="/dashboard/analyze">
              <Button>Analyze JD</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { company, role, extractedSkills, checklist, plan7Days, plan, questions, companyIntel, roundMapping } = entry
  const planData = plan7Days ?? plan ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/analyze">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {company || "Company"} — {role || "Role"}
          </h2>
          <p className="text-gray-500">Readiness: {Math.round(liveScore)}/100 (live)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Intel — only when company provided */}
        {companyIntel && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Company Intel</CardTitle>
              <CardDescription>Heuristic profile based on company name and JD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                  <p className="font-semibold text-gray-900">{companyIntel.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Industry</p>
                  <p className="font-medium text-gray-900">{companyIntel.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Size</p>
                  <p className="font-medium text-gray-900">{companyIntel.sizeLabel}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Typical Hiring Focus</p>
                <p className="text-sm text-gray-700">{companyIntel.hiringFocus}</p>
              </div>
              <p className="text-xs text-gray-400 italic">Demo Mode: Company intel generated heuristically.</p>
            </CardContent>
          </Card>
        )}

        {/* Round Mapping — vertical timeline */}
        {roundMapping && roundMapping.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Round Mapping</CardTitle>
              <CardDescription>Expected interview flow based on company and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roundMapping.map((r, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{r.roundTitle ?? r.round}</p>
                      <p className="text-sm text-gray-600 mt-1">Why this round matters: {r.whyItMatters ?? r.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Readiness Score */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Score</CardTitle>
            <CardDescription>Updates as you mark skills. Base +2 per "I know", -2 per "Need practice".</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularScore value={liveScore} />
          </CardContent>
        </Card>

        {/* Key Skills Extracted — interactive toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
            <CardDescription>Mark each skill — changes persist in history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(extractedToByCategory(extractedSkills)).map(([cat, skills]) =>
                skills.map((s) => {
                  const status = skillConfidenceMap[s] ?? "practice"
                  return (
                    <button
                      key={`${cat}-${s}`}
                      type="button"
                      onClick={() => handleToggleSkill(s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        status === "know"
                          ? "bg-primary/20 text-primary border border-primary/40"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {s}
                      <span className="text-xs opacity-75">({cat})</span>
                      <span className="text-xs font-normal">
                        {status === "know" ? "I know this" : "Need practice"}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Round-wise Checklist + export */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Round-wise Preparation Checklist</CardTitle>
              <CardDescription>Action items per interview round</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyChecklist}>
                <Copy className="w-4 h-4" />
                {copyFeedback === "checklist" ? "Copied" : "Copy checklist"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {checklist?.map((round) => (
              <div key={round.roundTitle ?? round.round}>
                <h4 className="font-semibold text-gray-900 mb-2">{round.roundTitle ?? round.round}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {round.items?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 7-Day Plan + export */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>7-Day Plan</CardTitle>
              <CardDescription>Adaptive prep schedule based on detected skills</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleCopyPlan}>
              <Copy className="w-4 h-4" />
              {copyFeedback === "plan" ? "Copied" : "Copy 7-day plan"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {planData?.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Day {day.day}: {day.focus ?? day.title}</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {(day.tasks ?? day.items ?? []).map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 10 Likely Questions + export */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>10 Likely Interview Questions</CardTitle>
              <CardDescription>Based on detected skills</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleCopyQuestions}>
              <Copy className="w-4 h-4" />
              {copyFeedback === "questions" ? "Copied" : "Copy 10 questions"}
            </Button>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {questions?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Export all */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Download everything as a single text file</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="gap-2" onClick={handleDownloadTxt}>
              <Download className="w-4 h-4" />
              Download as TXT
            </Button>
          </CardContent>
        </Card>

        {/* Action Next */}
        <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Action Next</CardTitle>
            <CardDescription>Focus on weak areas first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakSkills.length > 0 ? (
              <>
                <p className="text-sm text-gray-700">
                  Top skills to practice: <strong>{weakSkills.join(", ")}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Start Day 1 plan now.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                All skills marked as known. Start Day 1 plan to reinforce.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
