import { useState } from 'react'
import type { User, Role } from '../types'
import ShieldLogo from './ShieldLogo'
import { api } from '../api/mockApi'

interface Props {
  onLogin: (user: User) => void
}

interface DemoAccount {
  role: Role
  username: string
  password: string
  label: string
  description: string
}

const demoAccounts: DemoAccount[] = [
  {
    role: 'admin',
    username: 'admin',
    password: 'SecureCity2026',
    label: 'Administrator',
    description: 'Center-wide KPIs · 3 charts · analyst table + search · CSV export',
  },
  {
    role: 'analyst',
    username: 'Maria Santos',
    password: 'analyst01',
    label: 'Maria Santos',
    description: 'Personal KPIs only — data scoped to her own record',
  },
  {
    role: 'analyst',
    username: 'James Rivera',
    password: 'analyst02',
    label: 'James Rivera',
    description: 'Personal KPIs only — data scoped to his own record',
  },
  {
    role: 'architect',
    username: 'demo',
    password: 'Demo2026',
    label: 'System Architect',
    description: 'Interactive tour — auth flow · component tree · data flow · CI/CD · tech stack',
  },
]

const flowSteps = [
  {
    step: '1',
    fn: 'handleSubmit()',
    file: 'Login.tsx',
    what: 'Calls api.login() and handles loading / error states',
  },
  {
    step: '2',
    fn: 'api.login()',
    file: 'mockApi.ts',
    what: 'Validates credentials, throws on failure, strips password before returning',
  },
  {
    step: '3',
    fn: 'App.handleLogin()',
    file: 'App.tsx',
    what: 'Stores the safe user object and routes by role: admin → overview, analyst → mystats',
  },
  {
    step: '4',
    fn: 'useEffect fetch',
    file: 'Dashboard.tsx',
    what: 'Dashboard fires parallel API calls on mount — each resolves into its own state slice',
  },
]

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await api.login(username, password)
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const fillAccount = (account: DemoAccount) => {
    setUsername(account.username)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden py-8 px-4">
      {/* Grid backdrop */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-5xl flex flex-col xl:flex-row gap-6 items-start xl:items-center">

        {/* ── LEFT: Login form ─────────────────────────────────── */}
        <div className="w-full xl:w-96 shrink-0">
          <div className="bg-navy-light border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-accent/10 neon-border">
            <div className="flex flex-col items-center mb-8">
              <ShieldLogo size={72} glow />
              <h1 className="text-2xl font-bold text-white mt-4 tracking-wide">
                Secure City PD - RTCC
              </h1>
              <p className="text-sm text-accent tracking-[0.3em] mt-1 uppercase">
                Analytics Platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-navy font-bold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-all uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_32px_rgba(0,212,255,0.55)]"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-6">
              Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Demo panel ────────────────────────────────── */}
        <div className="w-full flex flex-col gap-4">

          {/* Demo accounts */}
          <div className="bg-navy-light border border-navy-lighter rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Demo Accounts — click to auto-fill
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  onClick={() => fillAccount(account)}
                  className={`w-full text-left p-3 rounded-xl border transition-all group ${
                    username === account.username
                      ? account.role === 'admin'
                        ? 'border-amber-500/60 bg-amber-500/10'
                        : account.role === 'architect'
                          ? 'border-purple-500/60 bg-purple-500/10'
                          : 'border-accent/60 bg-accent/10'
                      : 'border-navy-lighter hover:border-accent/40 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{account.label}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        account.role === 'admin'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                          : account.role === 'architect'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/40'
                            : 'bg-accent/10 text-accent border border-accent/40'
                      }`}
                    >
                      {account.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{account.description}</p>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    {account.username} / {account.password}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* System flow diagram */}
          <div className="bg-navy-light border border-navy-lighter rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              System Flow — what each function does
            </p>

            <div className="space-y-0">
              {flowSteps.map((s, i) => (
                <div key={s.step} className="flex gap-3">
                  {/* Step indicator + connector line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                      {s.step}
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className="w-px flex-1 bg-navy-lighter my-1" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className={i < flowSteps.length - 1 ? 'pb-4' : ''}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-accent text-xs font-mono bg-accent/10 px-2 py-0.5 rounded">
                        {s.fn}
                      </code>
                      <span className="text-slate-600 text-xs font-mono">{s.file}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.what}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Role routing visual */}
            <div className="mt-4 pt-4 border-t border-navy-lighter">
              <p className="text-xs text-slate-500 mb-3">Role → Dashboard routing</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-navy rounded-lg p-3 border border-navy-lighter text-center">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Admin</p>
                  <p className="text-xs text-slate-500 mt-1">Command Overview</p>
                  <p className="text-xs text-slate-600">charts · table · CSV</p>
                </div>
                <div className="flex items-center text-navy-lighter text-lg font-light">→</div>
                <div className="flex-1 rounded-lg p-3 border text-center bg-accent/5 border-accent/20">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider">Analyst</p>
                  <p className="text-xs text-slate-500 mt-1">Personal Stats</p>
                  <p className="text-xs text-slate-600">own data only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-navy-light border border-navy-lighter rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Built with</p>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'TypeScript', 'Vite 5', 'Tailwind CSS 4', 'Recharts', 'Vitest + RTL', 'ESLint', 'GitHub Actions'].map((t) => (
                <span key={t} className="text-xs text-slate-400 bg-navy border border-navy-lighter rounded px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
