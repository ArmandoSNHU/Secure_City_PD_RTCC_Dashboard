export const users = [
  { id: 0, username: 'admin', password: 'SecureCity2026', name: 'Administrator', role: 'admin' },
  { id: 1, username: 'Maria Santos', password: 'analyst01', name: 'Maria Santos', role: 'analyst' },
  { id: 2, username: 'James Rivera', password: 'analyst02', name: 'James Rivera', role: 'analyst' },
  { id: 3, username: 'Carlos Vega', password: 'analyst03', name: 'Carlos Vega', role: 'analyst' },
  { id: 4, username: 'Priya Nair', password: 'analyst04', name: 'Priya Nair', role: 'analyst' },
  { id: 5, username: 'Derek Thompson', password: 'analyst05', name: 'Derek Thompson', role: 'analyst' },
]

export const overviewStats = {
  totalLprHits: 1847,
  agenciesAssisted: 12,
  activeAnalysts: 5,
  alertsGenerated: 234,
}

export const analystStats = [
  { id: 1, name: 'Maria Santos', submissions: 14, lprHits: 412, agencies: 8, lookouts: 3, status: 'Active' },
  { id: 2, name: 'James Rivera', submissions: 12, lprHits: 389, agencies: 6, lookouts: 2, status: 'Active' },
  { id: 3, name: 'Carlos Vega', submissions: 15, lprHits: 356, agencies: 9, lookouts: 5, status: 'Active' },
  { id: 4, name: 'Priya Nair', submissions: 13, lprHits: 401, agencies: 7, lookouts: 1, status: 'Active' },
  { id: 5, name: 'Derek Thompson', submissions: 9, lprHits: 289, agencies: 4, lookouts: 2, status: 'Active' },
]

export const monthlyLprByAnalyst = [
  { month: 'Jan', 'Maria Santos': 350, 'James Rivera': 310, 'Carlos Vega': 295, 'Priya Nair': 330, 'Derek Thompson': 240 },
  { month: 'Feb', 'Maria Santos': 365, 'James Rivera': 340, 'Carlos Vega': 312, 'Priya Nair': 355, 'Derek Thompson': 255 },
  { month: 'Mar', 'Maria Santos': 390, 'James Rivera': 325, 'Carlos Vega': 330, 'Priya Nair': 370, 'Derek Thompson': 268 },
  { month: 'Apr', 'Maria Santos': 378, 'James Rivera': 360, 'Carlos Vega': 341, 'Priya Nair': 385, 'Derek Thompson': 274 },
  { month: 'May', 'Maria Santos': 405, 'James Rivera': 372, 'Carlos Vega': 348, 'Priya Nair': 392, 'Derek Thompson': 281 },
  { month: 'Jun', 'Maria Santos': 412, 'James Rivera': 389, 'Carlos Vega': 356, 'Priya Nair': 401, 'Derek Thompson': 289 },
]

export const agencyBreakdown = [
  { name: 'Sheriff', value: 35 },
  { name: 'DPS', value: 20 },
  { name: 'Constable', value: 15 },
  { name: 'FBI', value: 15 },
  { name: 'DEA', value: 10 },
  { name: 'CBP', value: 5 },
]

export const dailyAlerts = [
  { day: 1, alerts: 6 }, { day: 2, alerts: 8 }, { day: 3, alerts: 5 }, { day: 4, alerts: 9 },
  { day: 5, alerts: 11 }, { day: 6, alerts: 7 }, { day: 7, alerts: 4 }, { day: 8, alerts: 8 },
  { day: 9, alerts: 10 }, { day: 10, alerts: 12 }, { day: 11, alerts: 9 }, { day: 12, alerts: 7 },
  { day: 13, alerts: 6 }, { day: 14, alerts: 10 }, { day: 15, alerts: 13 }, { day: 16, alerts: 8 },
  { day: 17, alerts: 7 }, { day: 18, alerts: 11 }, { day: 19, alerts: 9 }, { day: 20, alerts: 6 },
  { day: 21, alerts: 8 }, { day: 22, alerts: 12 }, { day: 23, alerts: 10 }, { day: 24, alerts: 7 },
  { day: 25, alerts: 9 }, { day: 26, alerts: 5 }, { day: 27, alerts: 8 }, { day: 28, alerts: 11 },
  { day: 29, alerts: 7 }, { day: 30, alerts: 9 },
]

export const CHART_COLORS = ['#00d4ff', '#4f8ef7', '#9b5cf6', '#f76e8e', '#ffb648', '#3ddc97']
