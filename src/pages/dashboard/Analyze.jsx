import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeJD } from "@/lib/jdAnalysis"
import { saveAnalysis } from "@/lib/history"

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [jdText, setJdText] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    const result = analyzeJD(company, role, jdText)
    const entry = {
      company: company.trim(),
      role: role.trim(),
      jdText: jdText.trim(),
      extractedSkills: result.extractedSkills,
      checklist: result.checklist,
      plan: result.plan,
      questions: result.questions,
      readinessScore: result.readinessScore,
      companyIntel: result.companyIntel,
      roundMapping: result.roundMapping,
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
            <CardDescription>Enter company, role, and paste the full job description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
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
                Role
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
                Job Description
              </label>
              <textarea
                id="jd"
                rows={12}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                required
              />
            </div>
            <Button type="submit">Analyze</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
