import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import TestChecklist from './pages/TestChecklist'
import Ship from './pages/Ship'
import Proof from './pages/Proof'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Practice from './pages/dashboard/Practice'
import Assessments from './pages/dashboard/Assessments'
import Resources from './pages/dashboard/Resources'
import Profile from './pages/dashboard/Profile'
import Analyze from './pages/dashboard/Analyze'
import Results from './pages/dashboard/Results'
import History from './pages/dashboard/History'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/prp/07-test" element={<TestChecklist />} />
      <Route path="/prp/08-ship" element={<Ship />} />
      <Route path="/prp/proof" element={<Proof />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="practice" element={<Practice />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="results" element={<Results />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  )
}
