import type { User } from '../types'
import ShieldLogo from './ShieldLogo'

interface NavItem {
  id: string
  label: string
  icon: string
}

interface Props {
  user: User
  activeView: string
  onNavigate: (view: string) => void
  onLogout: () => void
}

const adminItems: NavItem[] = [
  { id: 'overview', label: 'Command Overview', icon: '📊' },
  { id: 'analysts', label: 'Analyst Activity', icon: '👥' },
]
const analystItems: NavItem[] = [
  { id: 'mystats', label: 'My Performance', icon: '📈' },
  { id: 'submit', label: 'Monthly Submission', icon: '📝' },
]
const architectItems: NavItem[] = [
  { id: 'authflow', label: 'Auth Flow', icon: '🔐' },
  { id: 'components', label: 'Component Tree', icon: '🌳' },
  { id: 'dataflow', label: 'Data Flow', icon: '🔄' },
  { id: 'cicd', label: 'CI/CD Pipeline', icon: '🚀' },
  { id: 'techstack', label: 'Tech Stack', icon: '⚙️' },
]

export default function Sidebar({ user, activeView, onNavigate, onLogout }: Props) {
  const items =
    user.role === 'admin' ? adminItems : user.role === 'architect' ? architectItems : analystItems

  return (
    <aside className="w-64 min-h-screen bg-navy-light border-r border-navy-lighter flex flex-col shrink-0">
      <div className="p-5 flex items-center gap-3 border-b border-navy-lighter">
        <ShieldLogo size={40} />
        <div>
          <p className="font-bold text-white leading-tight">Secure City PD</p>
          <p className="text-xs text-accent tracking-widest">RTCC ANALYTICS</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
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
