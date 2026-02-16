import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  getProofSteps,
  setProofStep,
  getFinalSubmission,
  setFinalSubmission,
  isValidUrl,
  isShippedStatus,
} from "@/lib/proofStorage"

function formatFinalSubmission(links) {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovableLink || "(not provided)"}
GitHub Repository: ${links.githubLink || "(not provided)"}
Live Deployment: ${links.deployedLink || "(not provided)"}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`
}

export default function Proof() {
  const [steps, setSteps] = useState(getProofSteps)
  const [links, setLinksState] = useState(getFinalSubmission)
  const [errors, setErrors] = useState({})
  const [shipped, setShipped] = useState(isShippedStatus)
  const [copyFeedback, setCopyFeedback] = useState(false)

  useEffect(() => {
    setSteps(getProofSteps())
    setLinksState(getFinalSubmission())
  }, [])

  useEffect(() => {
    setShipped(isShippedStatus())
  }, [steps, links])

  function handleStepToggle(id) {
    const step = steps.find((s) => s.id === id)
    if (!step) return
    const next = setProofStep(id, !step.completed)
    setSteps(next)
  }

  function handleLinkChange(field, value) {
    const next = { ...links, [field]: value }
    setLinksState(next)
    setFinalSubmission(next)
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  function validateLinks() {
    const next = {}
    if (links.lovableLink && !isValidUrl(links.lovableLink)) {
      next.lovableLink = "Enter a valid URL (e.g. https://...)"
    }
    if (links.githubLink && !isValidUrl(links.githubLink)) {
      next.githubLink = "Enter a valid URL (e.g. https://...)"
    }
    if (links.deployedLink && !isValidUrl(links.deployedLink)) {
      next.deployedLink = "Enter a valid URL (e.g. https://...)"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleCopySubmission() {
    if (!validateLinks()) return
    const text = formatFinalSubmission(links)
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 1500)
    })
  }

  const statusLabel = shipped ? "Shipped" : "In Progress"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              shipped ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Build Proof</h1>
          <p className="text-gray-600 mt-1">Complete steps and provide artifact links</p>
        </div>

        {shipped && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="py-6">
              <p className="text-lg text-gray-900 font-medium leading-relaxed">
                You built a real product.
              </p>
              <p className="text-lg text-gray-900 font-medium leading-relaxed mt-2">
                Not a tutorial. Not a clone.
              </p>
              <p className="text-lg text-gray-900 font-medium leading-relaxed mt-2">
                A structured tool that solves a real problem.
              </p>
              <p className="text-gray-700 mt-4">This is your proof of work.</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
            <CardDescription>Mark each step when completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step) => (
                <label key={step.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => handleStepToggle(step.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className={step.completed ? "text-gray-500 line-through" : "text-gray-900"}>
                    Step {step.id}: {step.label}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto">
                    {step.completed ? "Completed" : "Pending"}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artifact Inputs</CardTitle>
            <CardDescription>Required for Ship status. URLs must be valid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-gray-700 mb-1">
                Lovable Project Link
              </label>
              <input
                id="lovable"
                type="url"
                value={links.lovableLink}
                onChange={(e) => handleLinkChange("lovableLink", e.target.value)}
                onBlur={() => {
                  if (links.lovableLink && !isValidUrl(links.lovableLink)) {
                    setErrors((e) => ({ ...e, lovableLink: "Enter a valid URL (e.g. https://...)" }))
                  } else {
                    setErrors((e) => ({ ...e, lovableLink: null }))
                  }
                }}
                placeholder="https://lovable.dev/projects/..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.lovableLink ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.lovableLink && (
                <p className="text-sm text-red-600 mt-1">{errors.lovableLink}</p>
              )}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                id="github"
                type="url"
                value={links.githubLink}
                onChange={(e) => handleLinkChange("githubLink", e.target.value)}
                onBlur={() => {
                  if (links.githubLink && !isValidUrl(links.githubLink)) {
                    setErrors((e) => ({ ...e, githubLink: "Enter a valid URL (e.g. https://...)" }))
                  } else {
                    setErrors((e) => ({ ...e, githubLink: null }))
                  }
                }}
                placeholder="https://github.com/..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.githubLink ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.githubLink && (
                <p className="text-sm text-red-600 mt-1">{errors.githubLink}</p>
              )}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-gray-700 mb-1">
                Deployed URL
              </label>
              <input
                id="deployed"
                type="url"
                value={links.deployedLink}
                onChange={(e) => handleLinkChange("deployedLink", e.target.value)}
                onBlur={() => {
                  if (links.deployedLink && !isValidUrl(links.deployedLink)) {
                    setErrors((e) => ({ ...e, deployedLink: "Enter a valid URL (e.g. https://...)" }))
                  } else {
                    setErrors((e) => ({ ...e, deployedLink: null }))
                  }
                }}
                placeholder="https://your-app.vercel.app"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.deployedLink ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.deployedLink && (
                <p className="text-sm text-red-600 mt-1">{errors.deployedLink}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Final Submission Export</CardTitle>
            <CardDescription>Copy formatted submission text</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCopySubmission} className="gap-2">
              {copyFeedback ? "Copied!" : "Copy Final Submission"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
