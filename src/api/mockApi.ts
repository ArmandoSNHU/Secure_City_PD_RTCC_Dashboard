import type { User, AnalystStat, OverviewStats, MonthlyLprEntry, AgencyEntry, DailyAlertEntry, ReportForm, SubmissionResult } from '../types'
import { users, credentials, overviewStats, analystStats, monthlyLprByAnalyst, agencyBreakdown, dailyAlerts } from '../data/mockData'

const delay = (ms = 300): Promise<void> => new Promise((res) => setTimeout(res, ms))

export const api = {
  async login(username: string, password: string): Promise<User> {
    await delay()
    const normalised = username.trim().toLowerCase()
    const user = users.find((u) => u.username.toLowerCase() === normalised)
    const expectedPassword = user ? credentials[user.username] : undefined
    if (!user || expectedPassword !== password) {
      throw new Error('Invalid credentials. Access denied.')
    }
    return user
  },

  async getOverviewStats(): Promise<OverviewStats> {
    await delay()
    return overviewStats
  },

  async getAnalystStats(): Promise<AnalystStat[]> {
    await delay()
    return analystStats
  },

  async getAnalystById(id: number): Promise<AnalystStat | undefined> {
    await delay()
    return analystStats.find((a) => a.id === id)
  },

  async getMonthlyLprByAnalyst(): Promise<MonthlyLprEntry[]> {
    await delay()
    return monthlyLprByAnalyst
  },

  async getAgencyBreakdown(): Promise<AgencyEntry[]> {
    await delay()
    return agencyBreakdown
  },

  async getDailyAlerts(): Promise<DailyAlertEntry[]> {
    await delay()
    return dailyAlerts
  },

  async submitMonthlyReport(analystId: number, report: ReportForm): Promise<SubmissionResult> {
    await delay(500)
    return {
      success: true,
      submittedAt: new Date().toISOString(),
      analystId,
      report,
    }
  },
}
