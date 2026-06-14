import { useState, useEffect } from 'react'
import type { User, AnalystStat, ReportForm, SubmissionResult } from '../types'
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
  const [form, setForm] = useState<ReportForm>(initialForm)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ReportForm, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    api.getAnalystById(user.id).then((stat) => {
      if (stat) setMyStats(stat)
    })
  }, [user.id])

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
