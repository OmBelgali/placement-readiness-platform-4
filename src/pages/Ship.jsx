import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { areAllTestsPassed } from "@/lib/testChecklist"
import { Lock } from "lucide-react"

export default function Ship() {
  const unlocked = areAllTestsPassed()

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-gray-500" />
            </div>
            <CardTitle>Ship Locked</CardTitle>
            <CardDescription>
              Complete all 10 tests on the Test Checklist before shipping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/prp/07-test">
              <Button>Go to Test Checklist</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ship</h1>
          <p className="text-gray-600 mt-1">All tests passed. Ready to ship.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Deploy</CardTitle>
            <CardDescription>
              Your Placement Readiness Platform has passed all tests. Deploy to production when ready.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Push to GitHub and deploy via Vercel or your preferred host.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
