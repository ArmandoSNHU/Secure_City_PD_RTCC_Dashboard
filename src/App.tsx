import { useState } from 'react'
import type { User } from './types'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import AdminDashboard from './components/AdminDashboard'
import AnalystDashboard from './components/AnalystDashboard'
import ArchitectView from './components/ArchitectView'

type ViewId =
  | 'overview'
  | 'analysts'
  | 'mystats'
  | 'submit'
  | 'authflow'
  | 'components'
  | 'dataflow'
  | 'cicd'
  | 'techstack'

const viewTitles: Record<ViewId, string> = {
  overview: 'Command Overview',
  analysts: 'Analyst Activity',
  mystats: 'My Performance',
  submit: 'Monthly Submission',
  authflow: 'Authentication Flow',
  components: 'Component Tree',
  dataflow: 'Data Flow',
  cicd: 'CI/CD Pipeline',
  techstack: 'Tech Stack',
}

const viewSequence: Record<string, ViewId[]> = {
  admin: ['overview', 'analysts'],
  analyst: ['mystats', 'submit'],
  architect: ['authflow', 'components', 'dataflow', 'cicd', 'techstack'],
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [activeView, setActiveView] = useState<ViewId>('overview')

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    if (loggedInUser.role === 'admin') setActiveView('overview')
    else if (loggedInUser.role === 'architect') setActiveView('authflow')
    else setActiveView('mystats')
  }

  const handleLogout = () => setUser(null)

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const sequence = viewSequence[user.role] ?? []
  const currentIndex = sequence.indexOf(activeView)
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < sequence.length - 1
  const goBack = () => { if (canGoBack) setActiveView(sequence[currentIndex - 1]) }
  const goForward = () => { if (canGoForward) setActiveView(sequence[currentIndex + 1]) }

  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar
        user={user}
        activeView={activeView}
        onNavigate={(v) => setActiveView(v as ViewId)}
        onLogout={handleLogout}
      />
      <div className="flex-1 min-w-0">
        <TopNav
          user={user}
          title={viewTitles[activeView]}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={goBack}
          onForward={goForward}
        />
        {user.role === 'admin' && <AdminDashboard activeView={activeView} />}
        {user.role === 'analyst' && <AnalystDashboard user={user} activeView={activeView} />}
        {user.role === 'architect' && <ArchitectView activeView={activeView} />}
      </div>
    </div>
  )
}
