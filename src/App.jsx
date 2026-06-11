/**
 * Root component — owns authentication state and acts as the app's "router".
 *
 * WHY NO REACT ROUTER: there are only four views gated by two roles, so a
 * single `activeView` string + conditional rendering does the job with zero
 * dependencies. If the app ever needs real URLs / deep links, React Router
 * is the upgrade path.
 *
 * State design: the two top-level pieces of state live here and flow DOWN
 * via props; child components communicate UP via callbacks (onLogin,
 * onNavigate, onLogout). No global store/context — nothing is shared deeply
 * enough to justify one.
 */
import { useState } from 'react'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import AdminDashboard from './components/AdminDashboard'
import AnalystDashboard from './components/AnalystDashboard'

// Maps each view id (used by the sidebar) to the title shown in the top nav.
const viewTitles = {
  overview: 'Command Overview',
  analysts: 'Analyst Activity',
  mystats: 'My Performance',
  submit: 'Monthly Submission',
}

export default function App() {
  // `user` is the authenticated user object returned by the (mock) API.
  // null = logged out — the ONLY way to get past the login wall is a
  // successful api.login() call inside <Login/>.
  const [user, setUser] = useState(null)

  // Which view the sidebar has selected. Valid values depend on role
  // (admin: overview/analysts, analyst: mystats/submit).
  const [activeView, setActiveView] = useState('overview')

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    // Land each role on its natural home view after login.
    setActiveView(loggedInUser.role === 'admin' ? 'overview' : 'mystats')
  }

  // Clearing the user unmounts everything behind the login wall.
  const handleLogout = () => {
    setUser(null)
  }

  // Logged out → only the login screen exists.
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Sidebar renders different nav items depending on user.role */}
      <Sidebar
        user={user}
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />
      {/* min-w-0 lets the flex child shrink so wide charts/tables don't overflow */}
      <div className="flex-1 min-w-0">
        <TopNav user={user} title={viewTitles[activeView]} />
        {/*
         * ROLE-BASED ROUTING: the dashboard branch is on user.role, which
         * comes from the (mock) server — not from a URL or anything the
         * client can edit. An analyst physically cannot render the admin
         * component.
         */}
        {user.role === 'admin' ? (
          <AdminDashboard activeView={activeView} />
        ) : (
          <AnalystDashboard user={user} activeView={activeView} />
        )}
      </div>
    </div>
  )
}
