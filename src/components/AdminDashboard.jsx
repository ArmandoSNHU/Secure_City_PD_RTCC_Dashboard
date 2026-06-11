import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import StatCard from './StatCard'
import { api } from '../api/mockApi'
import { CHART_COLORS } from '../data/mockData'

const tooltipStyle = {
  backgroundColor: '#112240',
  border: '1px solid #1a2f52',
  borderRadius: '8px',
  color: '#e2e8f0',
}

export default function AdminDashboard({ activeView }) {
  const [stats, setStats] = useState(null)
  const [analysts, setAnalysts] = useState([])
  const [monthlyLpr, setMonthlyLpr] = useState([])
  const [agencies, setAgencies] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    api.getOverviewStats().then(setStats)
    api.getAnalystStats().then(setAnalysts)
    api.getMonthlyLprByAnalyst().then(setMonthlyLpr)
    api.getAgencyBreakdown().then(setAgencies)
    api.getDailyAlerts().then(setAlerts)
  }, [])

  if (!stats) {
    return <div className="p-8 text-slate-400">Loading command center data...</div>
  }

  const analystNames = analysts.map((a) => a.name)

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

            <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Agency Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={agencies}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={{ stroke: '#475569' }}
                    fontSize={11}
                  >
                    {agencies.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0a1628" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-navy-light border border-navy-lighter rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Daily Alerts Trend — Current Month
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={alerts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2f52" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} label={{ value: 'Day of Month', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => `Day ${d}`} />
                <Line type="monotone" dataKey="alerts" stroke="#00d4ff" strokeWidth={2.5} dot={{ fill: '#00d4ff', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeView === 'analysts' && (
        <div className="bg-navy-light border border-navy-lighter rounded-xl overflow-hidden">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider p-5 pb-0">
            Analyst Activity — Current Month
          </h2>
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
                {analysts.map((a) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
