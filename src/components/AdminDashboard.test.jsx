/**
 * AdminDashboard tests — KPI cards, chart headings, analyst table, and
 * the search/filter added in v1.4.
 *
 * Recharts is mocked: jsdom has no layout engine so ResponsiveContainer
 * renders at 0×0 and floods output with warnings. Chart rendering isn't
 * what these tests assert — data display and interactivity are.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from './AdminDashboard'

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

describe('AdminDashboard', () => {
  it('renders all four KPI stat cards after data loads', async () => {
    render(<AdminDashboard activeView="overview" />)
    expect(await screen.findByText(/total lpr hits this month/i)).toBeInTheDocument()
    expect(screen.getByText('1,847')).toBeInTheDocument()
    expect(screen.getByText(/agencies assisted/i)).toBeInTheDocument()
    expect(screen.getByText(/active analysts/i)).toBeInTheDocument()
    expect(screen.getByText(/alerts generated/i)).toBeInTheDocument()
  })

  it('shows the three chart section headings in the overview view', async () => {
    render(<AdminDashboard activeView="overview" />)
    expect(await screen.findByText(/monthly lpr hits by analyst/i)).toBeInTheDocument()
    expect(screen.getByText(/agency breakdown/i)).toBeInTheDocument()
    expect(screen.getByText(/daily alerts trend/i)).toBeInTheDocument()
  })

  it('renders all five analysts in the activity table', async () => {
    render(<AdminDashboard activeView="analysts" />)
    expect(await screen.findByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('James Rivera')).toBeInTheDocument()
    expect(screen.getByText('Carlos Vega')).toBeInTheDocument()
    expect(screen.getByText('Priya Nair')).toBeInTheDocument()
    expect(screen.getByText('Derek Thompson')).toBeInTheDocument()
  })

  it('filters the analyst table to matching rows by name', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard activeView="analysts" />)
    await screen.findByText('Maria Santos')

    await user.type(screen.getByRole('textbox', { name: /search analysts/i }), 'carlos')

    expect(screen.getByText('Carlos Vega')).toBeInTheDocument()
    expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    expect(screen.queryByText('James Rivera')).not.toBeInTheDocument()
  })

  it('restores all rows when the search is cleared', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard activeView="analysts" />)
    await screen.findByText('Maria Santos')

    const input = screen.getByRole('textbox', { name: /search analysts/i })
    await user.type(input, 'priya')
    expect(screen.queryByText('James Rivera')).not.toBeInTheDocument()

    await user.clear(input)
    expect(screen.getByText('James Rivera')).toBeInTheDocument()
    expect(screen.getByText('Priya Nair')).toBeInTheDocument()
  })
})
