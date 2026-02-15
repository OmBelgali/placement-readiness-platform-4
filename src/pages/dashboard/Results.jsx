import { useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getEntryById, getHistory } from "@/lib/history"
import { ChevronLeft } from "lucide-react"

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
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  )
}

export default function Results() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")

  const entry = useMemo(() => {
    if (id) return getEntryById(id)
    const history = getHistory()
    return history[0] || null
  }, [id])

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

  const { company, role, extractedSkills, checklist, plan, questions, readinessScore } = entry

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
          <p className="text-gray-500">Readiness: {readinessScore}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Score */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Score</CardTitle>
            <CardDescription>Based on JD analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularScore value={readinessScore} />
          </CardContent>
        </Card>

        {/* Key Skills Extracted */}
        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
            <CardDescription>Tags grouped by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(extractedSkills.byCategory || {}).map(([cat, skills]) =>
                skills.map((s) => (
                  <span
                    key={`${cat}-${s}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {s}
                    <span className="ml-1 text-gray-500 text-xs">({cat})</span>
                  </span>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Round-wise Checklist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Round-wise Preparation Checklist</CardTitle>
            <CardDescription>Action items per interview round</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {checklist?.map((round) => (
              <div key={round.round}>
                <h4 className="font-semibold text-gray-900 mb-2">{round.round}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {round.items?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 7-Day Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>7-Day Plan</CardTitle>
            <CardDescription>Adaptive prep schedule based on detected skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {plan?.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Day {day.day}: {day.title}</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {day.items?.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 10 Likely Questions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>10 Likely Interview Questions</CardTitle>
            <CardDescription>Based on detected skills</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {questions?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
