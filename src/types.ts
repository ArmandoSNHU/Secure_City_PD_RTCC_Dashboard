export type Role = 'admin' | 'analyst'
export type AnalystStatus = 'Active' | 'Inactive'

export interface User {
  id: number
  username: string
  name: string
  role: Role
}

export interface AnalystStat {
  id: number
  name: string
  submissions: number
  lprHits: number
  agencies: number
  lookouts: number
  status: AnalystStatus
}

export interface OverviewStats {
  totalLprHits: number
  agenciesAssisted: number
  activeAnalysts: number
  alertsGenerated: number
}

export interface MonthlyLprEntry {
  month: string
  [analyst: string]: string | number
}

export interface AgencyEntry {
  name: string
  value: number
}

export interface DailyAlertEntry {
  day: number
  alerts: number
}

export interface ReportForm {
  lprHits: string
  lookouts: string
  federalRequests: string
  localRequests: string
  intelRequests: string
}

export interface SubmissionResult {
  success: boolean
  submittedAt: string
  analystId: number
  report: ReportForm
}
