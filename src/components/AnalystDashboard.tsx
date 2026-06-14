import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { User, AnalystStat, MonthlyLprEntry, ReportForm, SubmissionResult } from '../types'
import StatCard from './StatCard'
import SkeletonCard from './SkeletonCard'
import { api } from '../api/mockApi'

interface Props {
  user: User
  activeView: string
}

interface FormField {
  key: keyof ReportForm
  label: string
  max: number
}

const initialForm: ReportForm = {
  lprHits: '',
  lookouts: '',
  federalRequests: '',
  localRequests: '',
  intelRequests: '',
}

const formFields: FormField[] = [
  { key: 'lprHits', label: 'LPR Hits', max: 9999 },
  { key: 'lookouts', label: 'LPR Lookouts Issued', max: 999 },
  { key: 'federalRequests', label: 'Federal Agency Requests', max: 999 },
  { key: 'localRequests', label: 'Local Agency Requests', max: 999 },
  { key: 'intelRequests', label: 'Intelligence Requests', max: 999 },
]

export default function AnalystDashboard({ user, activeView }: Props) {
  const [myStats, setMyStats] = useState<AnalystStat | null>(null)
  const [monthlyTrend, setMonthlyTrend] = useState<{ month: string; hits: number }[]>([])
  const [teamRanking, setTeamRanking] = useState<{ name: string; lprHits: number }[]>([])
  const [form, setForm] = useState<ReportForm>(initialForm)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ReportForm, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    Promise.all([
      api.getAnalystById(user.id),
      api.getMonthlyLprByAnalyst(),
      api.getAnalystStats(),
    ]).then(([stat, monthly, allAnalysts]) => {
      if (stat) setMyStats(stat)

      // Extract this analyst's monthly trend from the shared dataset
      const trend = monthly.map((entry: MonthlyLprEntry) => ({
        month: entry.month as string,
        hits: (entry[user.name] as number) ?? 0,
      }))
      setMonthlyTrend(trend)

      // Build team ranking sorted by LPR hits descending
      const ranked = [...allAnalysts].sort((a, b) => b.lprHits - a.lprHits)
      setTeamRanking(ranked.map((a) => ({ name: a.name.split(' ')[0], lprHits: a.lprHits })))
    })
  }, [user.id, user.name])

  const handleChange = (key: keyof ReportForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (formErrors[key]) setFormErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): Partial<Record<keyof ReportForm, string>> => {
    const errors: Partial<Record<keyof ReportForm, string>> = {}
    formFields.forEach(({ key, max }) => {
      const val = Number(form[key])
      if (form[key] === '') {
        errors[key] = 'Required'
      } else if (!Number.isInteger(val) || val < 0) {
        errors[key] = 'Enter a whole number of 0 or more'
      } else if (val > max) {
        errors[key] = `Maximum is ${max.toLocaleString()}`
      }
    })
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    setSubmitting(true)
    setConfirmation(null)
    const result = await api.submitMonthlyReport(user.id, form)
    setSubmitting(false)
    setConfirmation(result)
    setForm(initialForm)
  }

  if (!myStats) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  // Rank position (1-based)
  const myRank = teamRanking.findIndex((a) => a.name === user.name.split(' ')[0]) + 1

  return (
    <div className="p-6 space-y-6">
      {activeView === 'mystats' && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="My LPR Hits This Month" value={myStats.lprHits} icon="🚗" />
            <StatCard label="My Agency Assists" value={myStats.agencies} icon="🤝" />
            <StatCard label="LPR Lookouts Issued" value={myStats.lookouts} icon="📡" />
            <StatCard label="Submissions This Month" value={myStats.submissions} icon="📝" />
          </div>

          {/* Rank badge + summary */}
          <div className="bg-navy-light border border-navy-lighter rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/30 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-accent">#{myRank}</span>
                <span className="text-xs text-slate-500">Team rank</span>
              </div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Status: <span className="text-emerald-400 font-semibold">{myStats.status}</span>
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed border-t sm:border-t-0 sm:border-l border-navy-lighter pt-4 sm:pt-0 sm:pl-5">
              You have recorded{' '}
              <span className="text-accent font-semibold">{myStats.lprHits}</span> LPR hits this
              month, assisted{' '}
              <span className="text-accent font-semibold">{myStats.agencies}</span> partner agencies,
              and issued{' '}
              <span className="text-accent font-semibold">{myStats.lookouts}</span> lookouts. Use
              the Monthly Submission tab to file your activity report.
            </p>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Monthly LPR trend */}
            <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                My Monthly LPR Hits
              </h2>

              {/* sr-only accessible table */}
              <table className="sr-only">
                <caption>Monthly LPR hits for {user.name}</caption>
                <thead><tr><th>Month</th><th>LPR Hits</th></tr></thead>
                <tbody>
                  {monthlyTrend.map((r) => (
                    <tr key={r.month}><td>{r.month}</td><td>{r.hits}</td></tr>
                  ))}
                </tbody>
              </table>

              <div aria-hidden="true" className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1b2a', border: '1px solid #1e2d3d', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: '#00d4ff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hits"
                      name="LPR Hits"
                      stroke="#00d4ff"
                      strokeWidth={2}
                      dot={{ fill: '#00d4ff', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team ranking bar chart */}
            <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Team LPR Ranking
              </h2>

              {/* sr-only accessible table */}
              <table className="sr-only">
                <caption>Team LPR hits ranking</caption>
                <thead><tr><th>Analyst</th><th>LPR Hits</th></tr></thead>
                <tbody>
                  {teamRanking.map((r) => (
                    <tr key={r.name}><td>{r.name}</td><td>{r.lprHits}</td></tr>
                  ))}
                </tbody>
              </table>

              <div aria-hidden="true" className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamRanking} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1b2a', border: '1px solid #1e2d3d', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: '#00d4ff' }}
                    />
                    <Bar
                      dataKey="lprHits"
                      name="LPR Hits"
                      radius={[4, 4, 0, 0]}
                      fill="#00d4ff"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}

      {activeView === 'submit' && (
        <div className="max-w-2xl">
          <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
              Monthly Activity Submission
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Report your activity totals for the current month.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {formFields.map(({ key, label, max }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <input
                    id={key}
                    type="number"
                    min="0"
                    max={max}
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder="0"
                    className={`w-full bg-navy border rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                      formErrors[key]
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/50'
                        : 'border-navy-lighter focus:border-accent focus:ring-accent'
                    }`}
                  />
                  {formErrors[key] && (
                    <p className="mt-1 text-xs text-red-400">{formErrors[key]}</p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-navy font-bold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors uppercase tracking-wider text-sm mt-2"
              >
                {submitting ? 'Submitting...' : 'Submit Monthly Report'}
              </button>
            </form>

            {confirmation && (
              <div className="mt-5 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-4 py-3">
                <p className="text-emerald-400 text-sm font-semibold">
                  ✓ Submission confirmed
                </p>
                <p className="text-emerald-500/80 text-xs mt-1">
                  Report received {new Date(confirmation.submittedAt).toLocaleString()}. Thank you,{' '}
                  {user.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
