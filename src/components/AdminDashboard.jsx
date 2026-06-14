/**
 * Admin dashboard — center-wide analytics. Only reachable when the logged-in
 * user's role is 'admin' (App branches on user.role).
 *
 * Two views, both keeping the four KPI cards on top:
 *  - 'overview':  bar chart (6-month LPR hits per analyst),
 *                 pie chart (agency assist breakdown),
 *                 line chart (daily alerts this month)
 *  - 'analysts':  full analyst activity table with status pills
 *
 * Data: all five datasets are fetched in parallel on mount, each into its
 * own state slice, so charts render independently as data arrives.
 */
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import StatCard from './StatCard'
import SkeletonCard from './SkeletonCard'
import { api } from '../api/mockApi'
import { CHART_COLORS } from '../data/mockData'

// Shared tooltip styling so all three charts match the dark theme.
// Recharts' default tooltip is white — unreadable on a navy background.
const tooltipStyle = {
  backgroundColor: '#112240',
  border: '1px solid #1a2f52',
  borderRadius: '8px',
  color: '#e2e8f0',
}

export default function AdminDashboard({ activeView }) {
  // One state slice per dataset — each chart re-renders independently
  // as its own fetch resolves.
  const [stats, setStats] = useState(null)      // KPI numbers (null = still loading)
  const [analysts, setAnalysts] = useState([])  // table rows + bar chart series names
  const [monthlyLpr, setMonthlyLpr] = useState([]) // bar chart data
  const [agencies, setAgencies] = useState([])  // pie chart data
  const [alerts, setAlerts] = useState([])      // line chart data
  const [search, setSearch] = useState('')      // analyst table filter

  // Fire all five requests in parallel on mount (no awaits between them).
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

  // The bar chart needs one <Bar> per analyst; derive the series list from
  // the analyst records rather than hard-coding names twice.
  const analystNames = analysts.map((a) => a.name)

  // Analyst table rows that match the search input (name or status).
  const filteredAnalysts = analysts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.status.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* KPI cards — responsive: 4 columns -> 2 -> 1 as the screen narrows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total LPR Hits This Month" value={stats.totalLprHits.toLocaleString()} icon="🚗" />
        <StatCard label="Agencies Assisted" value={stats.agenciesAssisted} icon="🤝" />
        <StatCard label="Active Analysts" value={stats.activeAnalysts} icon="👥" />
        <StatCard label="Alerts Generated" value={stats.alertsGenerated} icon="🚨" />
      </div>

      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Grouped bar chart: one colored series per analyst, 6 months */}
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
                  {/* dataKey={name} picks each analyst's column out of the
                      monthlyLpr objects; color comes from the shared palette */}
                  {analystNames.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart: agency assist percentages with inline labels */}
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
                    {/* Pie slices are colored via <Cell>, one per data point;
                        navy stroke creates separation between slices */}
                    {agencies.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0a1628" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line chart: alert volume per day for the current month */}
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
          <div className="p-5 pb-0 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Analyst Activity — Current Month
            </h2>
            <input
              type="text"
              placeholder="Search by name or status…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search analysts"
              className="text-sm bg-navy border border-navy-lighter rounded-lg px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors w-56"
            />
          </div>
          {/* overflow-x-auto lets the table scroll horizontally on narrow screens */}
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
                        {/* Status pill: green = Active, gray = Inactive */}
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
