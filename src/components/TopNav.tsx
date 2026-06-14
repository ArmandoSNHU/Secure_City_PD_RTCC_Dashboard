import type { User } from '../types'

interface Props {
  user: User
  title: string
}

export default function TopNav({ user, title }: Props) {
  return (
    <header className="h-16 bg-navy-light border-b border-navy-lighter flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user.name}</p>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            user.role === 'admin'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
              : 'bg-accent/10 text-accent border border-accent/40'
          }`}
        >
          {user.role}
        </span>
        <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  )
}
