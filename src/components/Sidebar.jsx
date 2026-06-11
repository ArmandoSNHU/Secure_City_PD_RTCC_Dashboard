/**
 * Sidebar navigation — role-aware.
 *
 * Admin sees:   Command Overview / Analyst Activity
 * Analyst sees: My Performance / Monthly Submission
 *
 * The sidebar doesn't own any state; it reports clicks up to App via
 * onNavigate (view change) and onLogout (clears the user, returning the
 * whole app to the login screen).
 */
import ShieldLogo from './ShieldLogo'

export default function Sidebar({ user, activeView, onNavigate, onLogout }) {
  // Nav items per role. The `id` values match the view keys App understands.
  const adminItems = [
    { id: 'overview', label: 'Command Overview', icon: '📊' },
    { id: 'analysts', label: 'Analyst Activity', icon: '👥' },
  ]
  const analystItems = [
    { id: 'mystats', label: 'My Performance', icon: '📈' },
    { id: 'submit', label: 'Monthly Submission', icon: '📝' },
  ]
  const items = user.role === 'admin' ? adminItems : analystItems

  return (
    // shrink-0 keeps the sidebar at a fixed 16rem while the main column flexes
    <aside className="w-64 min-h-screen bg-navy-light border-r border-navy-lighter flex flex-col shrink-0">
      {/* Brand block */}
      <div className="p-5 flex items-center gap-3 border-b border-navy-lighter">
        <ShieldLogo size={40} />
        <div>
          <p className="font-bold text-white leading-tight">Secure City PD</p>
          <p className="text-xs text-accent tracking-widest">RTCC ANALYTICS</p>
        </div>
      </div>

      {/* Navigation — flex-1 pushes the logout button to the bottom */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            // Active item gets the accent treatment; inactive items get a
            // transparent border so nothing shifts on hover/selection.
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeView === item.id
                ? 'bg-accent/10 text-accent border border-accent/40'
                : 'text-slate-400 hover:text-white hover:bg-navy-lighter border border-transparent'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout — styled red to signal a destructive/exit action */}
      <div className="p-3 border-t border-navy-lighter">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
