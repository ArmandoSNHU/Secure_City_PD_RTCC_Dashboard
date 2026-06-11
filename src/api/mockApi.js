import {
  users,
  overviewStats,
  analystStats,
  monthlyLprByAnalyst,
  agencyBreakdown,
  dailyAlerts,
} from '../data/mockData'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export const api = {
  async login(username, password) {
    await delay()
    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    )
    if (!user) throw new Error('Invalid credentials. Access denied.')
    const { password: _, ...safeUser } = user
    return safeUser
  },

  async getOverviewStats() {
    await delay()
    return overviewStats
  },

  async getAnalystStats() {
    await delay()
    return analystStats
  },

  async getAnalystById(id) {
    await delay()
    return analystStats.find((a) => a.id === id)
  },

  async getMonthlyLprByAnalyst() {
    await delay()
    return monthlyLprByAnalyst
  },

  async getAgencyBreakdown() {
    await delay()
    return agencyBreakdown
  },

  async getDailyAlerts() {
    await delay()
    return dailyAlerts
  },

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
