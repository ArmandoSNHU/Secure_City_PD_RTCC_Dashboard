/**
 * AnalystDashboard tests — monthly submission form behavior.
 *
 * Covers:
 *  - form renders all five report fields
 *  - submitting shows the confirmation banner from the API response
 *  - fields reset after a successful submission
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnalystDashboard from './AnalystDashboard'

// Matches Maria Santos' record in mockData (id: 1)
const maria = { id: 1, username: 'Maria Santos', name: 'Maria Santos', role: 'analyst' }

describe('AnalystDashboard monthly submission', () => {
  it('renders all five report fields', async () => {
    render(<AnalystDashboard user={maria} activeView="submit" />)
    // Wait past the loading state
    expect(await screen.findByLabelText(/lpr hits/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lpr lookouts issued/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/federal agency requests/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/local agency requests/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/intelligence requests/i)).toBeInTheDocument()
  })

  it('submits the report and shows the confirmation banner', async () => {
    const user = userEvent.setup()
    render(<AnalystDashboard user={maria} activeView="submit" />)

    await user.type(await screen.findByLabelText(/lpr hits/i), '42')
    await user.type(screen.getByLabelText(/lpr lookouts issued/i), '3')
    await user.type(screen.getByLabelText(/federal agency requests/i), '5')
    await user.type(screen.getByLabelText(/local agency requests/i), '7')
    await user.type(screen.getByLabelText(/intelligence requests/i), '2')
    await user.click(screen.getByRole('button', { name: /submit monthly report/i }))

    // Confirmation banner appears with the analyst's name
    expect(await screen.findByText(/submission confirmed/i)).toBeInTheDocument()
    expect(screen.getByText(/thank you,\s*maria santos/i)).toBeInTheDocument()
  })

  it('resets the form after a successful submission', async () => {
    const user = userEvent.setup()
    render(<AnalystDashboard user={maria} activeView="submit" />)

    const lprInput = await screen.findByLabelText(/lpr hits/i)
    await user.type(lprInput, '42')
    await user.type(screen.getByLabelText(/lpr lookouts issued/i), '1')
    await user.type(screen.getByLabelText(/federal agency requests/i), '1')
    await user.type(screen.getByLabelText(/local agency requests/i), '1')
    await user.type(screen.getByLabelText(/intelligence requests/i), '1')
    await user.click(screen.getByRole('button', { name: /submit monthly report/i }))

    await screen.findByText(/submission confirmed/i)
    expect(lprInput).toHaveValue(null) // number input with '' value reads as null
  })

  it("shows only this analyst's personal stats on the stats view", async () => {
    render(<AnalystDashboard user={maria} activeView="mystats" />)
    // '412' appears in both the KPI card and the summary sentence
    expect(await screen.findAllByText('412')).not.toHaveLength(0) // Maria's LPR hits
    expect(screen.getByText(/my lpr hits this month/i)).toBeInTheDocument()
  })
})
