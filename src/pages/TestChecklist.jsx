import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTestChecklist, setTestChecklistItem, resetTestChecklist } from "@/lib/testChecklist"

export default function TestChecklist() {
  const [items, setItems] = useState(getTestChecklist)

  useEffect(() => {
    setItems(getTestChecklist())
  }, [])

  const passed = items.filter((i) => i.checked).length
  const allPassed = passed === 10

  function handleToggle(id) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const next = setTestChecklistItem(id, !item.checked)
    setItems(next)
  }

  function handleReset() {
    resetTestChecklist()
    setItems(getTestChecklist())
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
          <h1 className="text-2xl font-bold text-gray-900">Test Checklist</h1>
          <p className="text-gray-600 mt-1">Verify all features before shipping</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tests Passed: {passed} / 10</CardTitle>
            <CardDescription>
              {allPassed ? "All tests passed. Ready to ship." : "Fix issues before shipping."}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
            <CardDescription>Mark each item when verified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(item.id)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <span className={`font-medium ${item.checked ? "text-gray-500 line-through" : "text-gray-900"}`}>
                    {item.label}
                  </span>
                  {item.hint && (
                    <p className="text-sm text-gray-500 mt-1">How to test: {item.hint}</p>
                  )}
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset}>
            Reset checklist
          </Button>
          {allPassed ? (
            <Link to="/prp/08-ship">
              <Button>Go to Ship</Button>
            </Link>
          ) : (
            <Button disabled>Go to Ship</Button>
          )}
        </div>
      </div>
    </div>
  )
}
