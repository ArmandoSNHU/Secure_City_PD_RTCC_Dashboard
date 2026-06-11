import { useState } from 'react'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import AdminDashboard from './components/AdminDashboard'
import AnalystDashboard from './components/AnalystDashboard'

const viewTitles = {
  overview: 'Command Overview',
  analysts: 'Analyst Activity',
  mystats: 'My Performance',
  submit: 'Monthly Submission',
}

export default function App() {
  const [user, setUser] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setActiveView(loggedInUser.role === 'admin' ? 'overview' : 'mystats')
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar
        user={user}
        activeView={activeView}
        onNavigate={setActiveView}
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
