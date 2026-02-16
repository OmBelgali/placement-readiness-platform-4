import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getHistoryWithErrors } from "@/lib/history"
import { FileText } from "lucide-react"

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return "—"
  }
}

function getDisplayScore(entry) {
  return Math.round(entry.finalScore ?? entry.readinessScore ?? 0)
}

export default function History() {
  const { entries, corruptedCount } = useMemo(() => getHistoryWithErrors(), [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        <p className="text-gray-600">View past JD analyses</p>
      </div>

      {corruptedCount > 0 && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          {corruptedCount === 1
            ? "One saved entry couldn't be loaded. Create a new analysis."
            : "Some saved entries couldn't be loaded. Create a new analysis."}
        </div>
      )}

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No analyses yet. Analyze a job description to get started.</p>
            <Link to="/dashboard/analyze">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">Analyze JD</button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <Link key={e.id} to={`/dashboard/results?id=${e.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {e.company || "Unknown Company"} — {e.role || "Role"}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(e.createdAt)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {getDisplayScore(e)}/100
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
