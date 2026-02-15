import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Practice from './pages/dashboard/Practice'
import Assessments from './pages/dashboard/Assessments'
import Resources from './pages/dashboard/Resources'
import Profile from './pages/dashboard/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="practice" element={<Practice />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
