import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  User,
  CircleUser,
  ScanSearch,
  History,
  ClipboardCheck,
  Rocket,
  FileCheck,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/analyze', icon: ScanSearch, label: 'Analyze JD' },
  { to: '/dashboard/history', icon: History, label: 'History' },
  { to: '/dashboard/practice', icon: Code2, label: 'Practice' },
  { to: '/dashboard/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/dashboard/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/prp/07-test', icon: ClipboardCheck, label: 'Test Checklist' },
  { to: '/prp/08-ship', icon: Rocket, label: 'Ship' },
  { to: '/prp/proof', icon: FileCheck, label: 'Proof' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Placement Prep
          </h1>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleUser className="w-6 h-6 text-primary" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
