import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { OverviewStats, AnalystStat, MonthlyLprEntry, AgencyEntry, DailyAlertEntry } from '../types'
import StatCard from './StatCard'
import SkeletonCard from './SkeletonCard'
import { api } from '../api/mockApi'
import { CHART_COLORS } from '../data/mockData'

interface Props {
  activeView: string
}

const tooltipStyle = {
  backgroundColor: '#112240',
  border: '1px solid #1a2f52',
  borderRadius: '8px',
  color: '#e2e8f0',
}

export default function AdminDashboard({ activeView }: Props) {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [analysts, setAnalysts] = useState<AnalystStat[]>([])
  const [monthlyLpr, setMonthlyLpr] = useState<MonthlyLprEntry[]>([])
  const [agencies, setAgencies] = useState<AgencyEntry[]>([])
  const [alerts, setAlerts] = useState<DailyAlertEntry[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getOverviewStats().then(setStats)
    api.getAnalystStats().then(setAnalysts)
    api.getMonthlyLprByAnalyst().then(setMonthlyLpr)
    api.getAgencyBreakdown().then(setAgencies)
    api.getDailyAlerts().then(setAlerts)
  }, [])

  if (!stats) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const analystNames = analysts.map((a) => a.name)

  const filteredAnalysts = analysts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.status.toLowerCase().includes(search.toLowerCase())
  )

  const exportCsv = () => {
    const headers = ['Analyst', 'Submissions', 'LPR Hits', 'LPR Lookouts', 'Agencies Helped', 'Status']
    const rows = filteredAnalysts.map((a) =>
      [a.name, a.submissions, a.lprHits, a.lookouts, a.agencies, a.status]
    )
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `analyst-activity-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total LPR Hits This Month" value={stats.totalLprHits.toLocaleString()} icon="🚗" />
        <StatCard label="Agencies Assisted" value={stats.agenciesAssisted} icon="🤝" />
        <StatCard label="Active Analysts" value={stats.activeAnalysts} icon="👥" />
        <StatCard label="Alerts Generated" value={stats.alertsGenerated} icon="🚨" />
      </div>

      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-navy-light border border-navy-lighter rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Monthly LPR Hits by Analyst (Last 6 Months)
              </h2>
              <table className="sr-only">
                <caption>Monthly LPR hits per analyst — last 6 months</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    {analystNames.map((n) => <th key={n} scope="col">{n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {monthlyLpr.map((row) => (
                    <tr key={row.month as string}>
                      <th scope="row">{row.month as string}</th>
                      {analystNames.map((n) => <td key={n}>{row[n]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div aria-hidden="true">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={monthlyLpr}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2f52" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {analystNames.map((name, i) => (
                      <Bar key={name} dataKey={name} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Agency Breakdown
              </h2>
              <table className="sr-only">
                <caption>Agency assist breakdown by percentage</caption>
                <thead><tr><th scope="col">Agency</th><th scope="col">Percentage</th></tr></thead>
                <tbody>
                  {agencies.map((a) => (
                    <tr key={a.name}><th scope="row">{a.name}</th><td>{a.value}%</td></tr>
                  ))}
                </tbody>
              </table>
              <div aria-hidden="true">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={agencies}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      label={({ name, value, x, y, textAnchor }: { name: string; value: number; x: number; y: number; textAnchor: 'inherit' | 'start' | 'middle' | 'end' }) => (
                        <text x={x} y={y} textAnchor={textAnchor} fill="#e2e8f0" fontSize={11}>{`${name} ${value}%`}</text>
                      )}
                      labelLine={{ stroke: '#475569' }}
                    >
                      {agencies.map((entry, i) => (
                        <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0a1628" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#ffffff' }} formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Daily Alerts Trend — Current Month
            </h2>
            <table className="sr-only">
              <caption>Daily alert counts for the current month</caption>
              <thead><tr><th scope="col">Day</th><th scope="col">Alerts</th></tr></thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.day}><th scope="row">Day {a.day}</th><td>{a.alerts}</td></tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={alerts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2f52" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} label={{ value: 'Day of Month', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={(d: number) => `Day ${d}`} />
                  <Line type="monotone" dataKey="alerts" stroke="#00d4ff" strokeWidth={2.5} dot={{ fill: '#00d4ff', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeView === 'analysts' && (
        <div className="bg-navy-light border border-navy-lighter rounded-xl overflow-hidden">
          <div className="p-5 pb-0 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Analyst Activity — Current Month
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or status…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search analysts"
                className="text-sm bg-navy border border-navy-lighter rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors w-56"
              />
              <button
                onClick={exportCsv}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-navy-lighter">
                  <th className="pb-3 pr-4">Analyst</th>
                  <th className="pb-3 pr-4">Submissions</th>
                  <th className="pb-3 pr-4">LPR Hits</th>
                  <th className="pb-3 pr-4">LPR Lookouts</th>
                  <th className="pb-3 pr-4">Agencies Helped</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalysts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      No analysts match &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredAnalysts.map((a) => (
                    <tr key={a.id} className="border-b border-navy-lighter/50 hover:bg-navy/50">
                      <td className="py-3.5 pr-4 font-medium text-white">{a.name}</td>
                      <td className="py-3.5 pr-4 text-slate-300">{a.submissions}</td>
                      <td className="py-3.5 pr-4 text-accent font-semibold">{a.lprHits}</td>
                      <td className="py-3.5 pr-4 text-slate-300">{a.lookouts}</td>
                      <td className="py-3.5 pr-4 text-slate-300">{a.agencies}</td>
                      <td className="py-3.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            a.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-500/15 text-slate-400 border border-slate-500/40'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
