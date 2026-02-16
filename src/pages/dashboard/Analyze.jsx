import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeJD } from "@/lib/jdAnalysis"
import { saveAnalysis } from "@/lib/history"

const MIN_JD_LENGTH = 200

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [jdText, setJdText] = useState("")
  const [jdWarning, setJdWarning] = useState(null)

  function handleJdChange(e) {
    const val = e.target.value
    setJdText(val)
    if (val.length > 0 && val.length < MIN_JD_LENGTH) {
      setJdWarning("This JD is too short to analyze deeply. Paste full JD for better output.")
    } else {
      setJdWarning(null)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = jdText.trim()
    if (!trimmed) return

    const result = analyzeJD(company.trim(), role.trim(), trimmed)
    const entry = {
      company: company.trim() || "",
      role: role.trim() || "",
      jdText: trimmed,
      extractedSkills: result.extractedSkills,
      roundMapping: result.roundMapping,
      checklist: result.checklist,
      plan7Days: result.plan7Days,
      questions: result.questions,
      baseScore: result.baseScore,
      skillConfidenceMap: {},
      finalScore: result.baseScore,
      companyIntel: result.companyIntel,
    }
    const saved = saveAnalysis(entry)
    navigate(`/dashboard/results?id=${saved.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analyze Job Description</h2>
        <p className="text-gray-600">Paste a JD to extract skills and get a personalized prep plan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter company, role, and paste the full job description. JD is required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name (optional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Amazon"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role (optional)
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE 1, Full Stack Developer"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description (required)
              </label>
              <textarea
                id="jd"
                rows={12}
                value={jdText}
                onChange={handleJdChange}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                required
                minLength={1}
              />
              {jdWarning && (
                <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  {jdWarning}
                </p>
              )}
            </div>
            <Button type="submit">Analyze</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
