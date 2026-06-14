/**
 * App integration tests — full login -> dashboard -> logout flows, exercising
 * the role-based routing exactly as a user would.
 *
 * Recharts is mocked: jsdom has no layout engine, so ResponsiveContainer
 * renders at 0x0 and floods the output with warnings. Chart rendering isn't
 * what these tests assert anyway — routing and data scoping are.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('recharts', () => {
  const Stub = ({ children }) => <div>{children}</div>
  return {
    ResponsiveContainer: Stub,
    BarChart: Stub,
    Bar: Stub,
    PieChart: Stub,
    Pie: Stub,
    Cell: Stub,
    LineChart: Stub,
    Line: Stub,
    XAxis: Stub,
    YAxis: Stub,
    CartesianGrid: Stub,
    Tooltip: Stub,
    Legend: Stub,
  }
})

async function login(user, username, password) {
  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /secure login/i }))
}

describe('App role-based routing', () => {
  it('shows only the login screen when logged out', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /secure login/i })).toBeInTheDocument()
    // No dashboard chrome should exist yet
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument()
  })

  it('routes admin to the Command Overview with center-wide stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user, 'admin', 'SecureCity2026')

    // Admin landing view + admin-only KPI card
    expect(await screen.findByRole('heading', { name: /command overview/i })).toBeInTheDocument()
    expect(await screen.findByText(/total lpr hits this month/i)).toBeInTheDocument()
    expect(await screen.findByText('1,847')).toBeInTheDocument()
    // Admin nav items present
    expect(screen.getByRole('button', { name: /analyst activity/i })).toBeInTheDocument()
  })

  it('routes an analyst to My Performance with only their own stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user, 'Maria Santos', 'analyst01')

    expect(await screen.findByRole('heading', { name: /my performance/i })).toBeInTheDocument()
    // Maria's own LPR hits (appears in both the KPI card and summary text)
    expect(await screen.findAllByText('412')).not.toHaveLength(0)
    // ...but no admin views or other analysts' data
    expect(screen.queryByText(/command overview/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/derek thompson/i)).not.toBeInTheDocument()
  })

  it('logout returns to the login screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user, 'Maria Santos', 'analyst01')
    await screen.findByRole('heading', { name: /my performance/i })

    await user.click(screen.getByRole('button', { name: /logout/i }))

    expect(screen.getByRole('button', { name: /secure login/i })).toBeInTheDocument()
    expect(screen.queryByText(/my performance/i)).not.toBeInTheDocument()
  })
})
