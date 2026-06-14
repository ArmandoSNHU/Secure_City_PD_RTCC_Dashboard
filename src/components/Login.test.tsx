import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

async function loginAs(user: ReturnType<typeof userEvent.setup>, username: string, password: string) {
  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /secure login/i }))
}

describe('Login', () => {
  it('shows an error and does not call onLogin for invalid credentials', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<Login onLogin={onLogin} />)

    await loginAs(user, 'admin', 'wrong-password')

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
    expect(onLogin).not.toHaveBeenCalled()
  })

  it('calls onLogin with the admin user on valid credentials', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<Login onLogin={onLogin} />)

    await loginAs(user, 'admin', 'SecureCity2026')

    await vi.waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1))
    expect(onLogin).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'admin', role: 'admin' })
    )
  })

  it('never exposes the password on the returned user object', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<Login onLogin={onLogin} />)

    await loginAs(user, 'Maria Santos', 'analyst01')

    await vi.waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1))
    const returnedUser = onLogin.mock.calls[0][0] as Record<string, unknown>
    expect(returnedUser).not.toHaveProperty('password')
    expect(returnedUser.role).toBe('analyst')
  })

  it('accepts the username case-insensitively', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<Login onLogin={onLogin} />)

    await loginAs(user, 'maria santos', 'analyst01')

    await vi.waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1))
    expect((onLogin.mock.calls[0][0] as Record<string, unknown>).name).toBe('Maria Santos')
  })
})
