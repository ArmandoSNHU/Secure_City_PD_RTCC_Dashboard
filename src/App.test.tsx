import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('recharts', () => {
  const Stub = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
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

async function login(user: ReturnType<typeof userEvent.setup>, username: string, password: string) {
  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /secure login/i }))
}

describe('App role-based routing', () => {
  it('shows only the login screen when logged out', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /secure login/i })).toBeInTheDocument()
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument()
  })

  it('routes admin to the Command Overview with center-wide stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user, 'admin', 'SecureCity2026')

    expect(await screen.findByRole('heading', { name: /command overview/i })).toBeInTheDocument()
    expect(await screen.findByText(/total lpr hits this month/i)).toBeInTheDocument()
    expect(await screen.findByText('1,847')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyst activity/i })).toBeInTheDocument()
  })

  it('routes an analyst to My Performance with only their own stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await login(user, 'Maria Santos', 'analyst01')

    expect(await screen.findByRole('heading', { name: /my performance/i })).toBeInTheDocument()
    expect(await screen.findAllByText('412')).not.toHaveLength(0)
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
