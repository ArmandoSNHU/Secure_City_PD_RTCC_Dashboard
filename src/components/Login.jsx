/**
 * Login screen — the only view reachable while logged out.
 *
 * Flow: controlled form -> api.login() -> on success, hand the safe user
 * object (password already stripped by the API) up to App via onLogin;
 * on failure, render the API's error message in a red alert box.
 *
 * The button disables and shows "Authenticating..." while the (simulated)
 * network call is in flight.
 */
import { useState } from 'react'
import ShieldLogo from './ShieldLogo'
import { api } from '../api/mockApi'

export default function Login({ onLogin }) {
  // Controlled inputs — React state is the single source of truth for the form.
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')     // API error message, '' = no error
  const [loading, setLoading] = useState(false) // true while login call is in flight

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the browser's default full-page form post
    setError('')
    setLoading(true)
    try {
      const user = await api.login(username, password)
      onLogin(user) // App takes over: stores user + routes by role
    } catch (err) {
      setError(err.message) // "Invalid credentials. Access denied."
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      {/*
       * Subtle grid-line backdrop, pure CSS: two layered linear-gradients
       * (horizontal + vertical 1px lines) repeated every 48px. No image
       * assets needed.
       */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-navy-light border border-navy-lighter rounded-2xl p-8 shadow-2xl shadow-accent/5">
          {/* Branding header */}
          <div className="flex flex-col items-center mb-8">
            <ShieldLogo size={72} />
            <h1 className="text-2xl font-bold text-white mt-4 tracking-wide">
              Secure City PD - RTCC
            </h1>
            <p className="text-sm text-accent tracking-[0.3em] mt-1 uppercase">
              Analytics Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              {/* type="password" masks input; browser handles the dots */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-navy border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            {/* Error alert — only rendered when the API rejected the login */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-navy font-bold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors uppercase tracking-wider text-sm"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Authorized personnel only. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
