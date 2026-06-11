import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import { api } from '../api/mockApi'

const initialForm = {
  lprHits: '',
  lookouts: '',
  federalRequests: '',
  localRequests: '',
  intelRequests: '',
}

const formFields = [
  { key: 'lprHits', label: 'LPR Hits' },
  { key: 'lookouts', label: 'LPR Lookouts Issued' },
  { key: 'federalRequests', label: 'Federal Agency Requests' },
  { key: 'localRequests', label: 'Local Agency Requests' },
  { key: 'intelRequests', label: 'Intelligence Requests' },
]

export default function AnalystDashboard({ user, activeView }) {
  const [myStats, setMyStats] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    api.getAnalystById(user.id).then(setMyStats)
  }, [user.id])

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setConfirmation(null)
    const result = await api.submitMonthlyReport(user.id, form)
    setSubmitting(false)
    setConfirmation(result)
    setForm(initialForm)
  }

  if (!myStats) {
    return <div className="p-8 text-slate-400">Loading your performance data...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {activeView === 'mystats' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="My LPR Hits This Month" value={myStats.lprHits} icon="🚗" />
            <StatCard label="My Agency Assists" value={myStats.agencies} icon="🤝" />
            <StatCard label="LPR Lookouts Issued" value={myStats.lookouts} icon="📡" />
            <StatCard label="Submissions This Month" value={myStats.submissions} icon="📝" />
          </div>

          <div className="bg-navy-light border border-navy-lighter rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Performance Summary
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              You have recorded <span className="text-accent font-semibold">{myStats.lprHits}</span> LPR
              hits this month and assisted <span className="text-accent font-semibold">{myStats.agencies}</span> partner
              agencies. Your current status is{' '}
              <span className="text-emerald-400 font-semibold">{myStats.status}</span>. Submit your
              monthly activity report from the Monthly Submission tab.
            </p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder="0"
                    className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
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
