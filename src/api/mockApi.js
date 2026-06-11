/**
 * Mock REST API layer — simulates a backend so the UI is written exactly as
 * it would be against a real server.
 *
 * Every function is async and awaits an artificial network delay. This is
 * deliberate: it forces components to handle loading states and awaited
 * calls, the same conditions a production app faces.
 *
 * TO GO REAL: replace each function body with a fetch() call to a REST
 * endpoint (e.g. POST /api/auth/login). No component needs to change —
 * this file is the only seam between the UI and the data.
 */
import {
  users,
  overviewStats,
  analystStats,
  monthlyLprByAnalyst,
  agencyBreakdown,
  dailyAlerts,
} from '../data/mockData'

// Simulated network latency so loading states actually render.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export const api = {
  /**
   * Authenticate a user.
   * - Username match is case-insensitive and trimmed (friendlier login UX).
   * - Throws on bad credentials so the UI exercises real error handling.
   * - Strips the password from the returned object — mirroring what a real
   *   API must do: never send credentials back to the client.
   */
  async login(username, password) {
    await delay()
    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    )
    if (!user) throw new Error('Invalid credentials. Access denied.')
    const { password: _, ...safeUser } = user
    return safeUser
  },

  /** Center-wide KPI numbers for the admin stat cards. */
  async getOverviewStats() {
    await delay()
    return overviewStats
  },

  /** All analyst records — admin-only table data. */
  async getAnalystStats() {
    await delay()
    return analystStats
  },

  /**
   * A single analyst's record. The analyst dashboard calls this with the
   * logged-in user's id, so an analyst only ever receives their own data.
   */
  async getAnalystById(id) {
    await delay()
    return analystStats.find((a) => a.id === id)
  },

  /** Six months of per-analyst LPR hits for the admin bar chart. */
  async getMonthlyLprByAnalyst() {
    await delay()
    return monthlyLprByAnalyst
  },

  /** Agency assist percentages for the admin pie chart. */
  async getAgencyBreakdown() {
    await delay()
    return agencyBreakdown
  },

  /** Daily alert counts for the admin line chart. */
  async getDailyAlerts() {
    await delay()
    return dailyAlerts
  },

  /**
   * Accept an analyst's monthly activity report.
   * Returns a server-style confirmation with an ISO timestamp — the UI
   * displays this in the success banner. Slightly longer delay to make the
   * "Submitting..." button state visible.
   */
  async submitMonthlyReport(analystId, report) {
    await delay(500)
    return {
      success: true,
      submittedAt: new Date().toISOString(),
      analystId,
      report,
    }
  },
}
