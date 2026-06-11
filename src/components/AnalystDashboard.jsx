/**
 * Analyst dashboard — personal stats + monthly report submission. Only
 * reachable when the logged-in user's role is 'analyst'.
 *
 * DATA SCOPING: this component fetches only the logged-in analyst's record
 * via api.getAnalystById(user.id) — an analyst never receives other
 * analysts' data. (In production this scoping would also be enforced
 * server-side.)
 *
 * Two views:
 *  - 'mystats': four personal KPI cards + plain-language summary
 *  - 'submit':  monthly activity form -> mock API -> confirmation banner
 */
import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import { api } from '../api/mockApi'

// Blank form shape. Kept as a constant so submit can reset the form to it.
const initialForm = {
  lprHits: '',
  lookouts: '',
  federalRequests: '',
  localRequests: '',
  intelRequests: '',
}

// The form is rendered from this array, so adding/removing a field is a
// one-line change here instead of copy-pasting JSX.
const formFields = [
  { key: 'lprHits', label: 'LPR Hits' },
  { key: 'lookouts', label: 'LPR Lookouts Issued' },
  { key: 'federalRequests', label: 'Federal Agency Requests' },
  { key: 'localRequests', label: 'Local Agency Requests' },
  { key: 'intelRequests', label: 'Intelligence Requests' },
]

export default function AnalystDashboard({ user, activeView }) {
  const [myStats, setMyStats] = useState(null)        // this analyst's record (null = loading)
  const [form, setForm] = useState(initialForm)       // controlled form values
  const [submitting, setSubmitting] = useState(false) // true while the report POST is in flight
  const [confirmation, setConfirmation] = useState(null) // API confirmation -> success banner

  // Fetch ONLY this analyst's record. user.id in the dependency array means
  // a different analyst logging in would trigger a fresh fetch.
  useEffect(() => {
    api.getAnalystById(user.id).then(setMyStats)
  }, [user.id])

  // Generic change handler — updates one field by key, preserving the rest.
  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the browser's default full-page form post
    setSubmitting(true)
    setConfirmation(null) // clear any previous banner before re-submitting
    const result = await api.submitMonthlyReport(user.id, form)
    setSubmitting(false)
    setConfirmation(result) // shows the green confirmation banner
    setForm(initialForm)    // reset fields for the next entry
  }

  if (!myStats) {
    return <div className="p-8 text-slate-400">Loading your performance data...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {activeView === 'mystats' && (
        <>
          {/* Personal KPI cards — same StatCard component the admin view uses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="My LPR Hits This Month" value={myStats.lprHits} icon="🚗" />
            <StatCard label="My Agency Assists" value={myStats.agencies} icon="🤝" />
            <StatCard label="LPR Lookouts Issued" value={myStats.lookouts} icon="📡" />
            <StatCard label="Submissions This Month" value={myStats.submissions} icon="📝" />
          </div>

          {/* Plain-language recap of the numbers above */}
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
              {/* Fields generated from the formFields array above */}
              {formFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  {/* type="number" + min="0": browser enforces numeric,
                      non-negative input; `required` blocks empty submits */}
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

            {/* Success banner — rendered only after the API confirms receipt */}
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
