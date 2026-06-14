import { useState } from 'react'
import type { User } from './types'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import AdminDashboard from './components/AdminDashboard'
import AnalystDashboard from './components/AnalystDashboard'

type ViewId = 'overview' | 'analysts' | 'mystats' | 'submit'

const viewTitles: Record<ViewId, string> = {
  overview: 'Command Overview',
  analysts: 'Analyst Activity',
  mystats: 'My Performance',
  submit: 'Monthly Submission',
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [activeView, setActiveView] = useState<ViewId>('overview')

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setActiveView(loggedInUser.role === 'admin' ? 'overview' : 'mystats')
  }

  const handleLogout = () => setUser(null)

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar
        user={user}
        activeView={activeView}
        onNavigate={(v) => setActiveView(v as ViewId)}
        onLogout={handleLogout}
      />
      <div className="flex-1 min-w-0">
        <TopNav user={user} title={viewTitles[activeView]} />
        {user.role === 'admin' ? (
          <AdminDashboard activeView={activeView} />
        ) : (
          <AnalystDashboard user={user} activeView={activeView} />
        )}
      </div>
    </div>
  )
}
