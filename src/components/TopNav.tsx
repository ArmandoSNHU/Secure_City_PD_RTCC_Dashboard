import type { User } from '../types'

interface Props {
  user: User
  title: string
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
}

export default function TopNav({ user, title, canGoBack, canGoForward, onBack, onForward }: Props) {
  const roleBadge =
    user.role === 'admin'
      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
      : user.role === 'architect'
        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/40'
        : 'bg-accent/10 text-accent border border-accent/40'

  return (
    <header className="h-16 bg-navy-light border-b border-navy-lighter flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Back / Forward + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Previous page"
          className="w-8 h-8 rounded-lg border border-navy-lighter flex items-center justify-center text-slate-400 hover:text-white hover:border-accent/50 hover:bg-accent/5 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          aria-label="Next page"
          className="w-8 h-8 rounded-lg border border-navy-lighter flex items-center justify-center text-slate-400 hover:text-white hover:border-accent/50 hover:bg-accent/5 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user.name}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${roleBadge}`}>
          {user.role}
        </span>
        <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  )
}
