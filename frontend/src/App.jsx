import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://banksphere-b1th.onrender.com'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('banksphere_token') || '')
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  })

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, options)
    const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }))
    if (!response.ok) throw new Error(data.message || 'Request failed')
    return data
  }

  const loadDashboard = async () => {
    if (!token) return
    try {
      setBusy(true)
      const me = await api('/api/auth/me', { headers: authHeaders() })
      setUser(me.data)

      const accountResponse = await api(`/api/accounts/user/${me.data.id}`, { headers: authHeaders() })
      setAccounts(accountResponse.data)
      if (accountResponse.data.length) {
        const id = accountResponse.data[0].id
        setSelectedAccount(id)
        const transactionResponse = await api(`/api/transactions/account/${id}`, { headers: authHeaders() })
        setTransactions(transactionResponse.data)
      }
    } catch (error) {
      setNotice(error.message)
      if (error.message === 'Authentication required' || error.message === 'Invalid or expired token') logout()
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])

  useEffect(() => {
    if (!selectedAccount || !token) return
    api(`/api/transactions/account/${selectedAccount}`, { headers: authHeaders() })
      .then(result => setTransactions(result.data))
      .catch(error => setNotice(error.message))
  }, [selectedAccount])

  const registerOrLogin = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    try {
      setBusy(true)
      setNotice('')
      if (mode === 'register') {
        const data = await api('/api/auth/register', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            firstName: form.get('firstName'),
            lastName: form.get('lastName'),
            email: form.get('email'),
            password: form.get('password')
          })
        })
        localStorage.setItem('banksphere_token', data.data.token)
        setToken(data.data.token)
      } else {
        const data = await api('/api/auth/login', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            email: form.get('email'),
            password: form.get('password')
          })
        })
        localStorage.setItem('banksphere_token', data.data.token)
        setToken(data.data.token)
      }
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('banksphere_token')
    setToken('')
    setUser(null)
    setAccounts([])
    setTransactions([])
  }

  const createAccount = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      setBusy(true)
      await api('/api/accounts', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          accountNumber: form.get('accountNumber'),
          accountType: form.get('accountType'),
          currency: 'USD'
        })
      })
      setNotice('Account created')
      event.currentTarget.reset()
      await loadDashboard()
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitMoney = async (event, transactionType) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      setBusy(true)
      await api('/api/transactions', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          accountId: selectedAccount,
          transactionType,
          amount: Number(form.get('amount')),
          description: form.get('description')
        })
      })
      setNotice(`${transactionType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} completed`)
      event.currentTarget.reset()
      await loadDashboard()
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  const transfer = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      setBusy(true)
      await api('/api/transfers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          fromAccountId: selectedAccount,
          toAccountId: form.get('toAccountId'),
          amount: Number(form.get('amount')),
          description: form.get('description')
        })
      })
      setNotice('Transfer completed')
      event.currentTarget.reset()
      await loadDashboard()
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand">BS</div>
          <p className="eyebrow">BANKSPHERE</p>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="muted">Secure access to your banking dashboard.</p>

          <form onSubmit={registerOrLogin} className="form">
            {mode === 'register' && (
              <div className="grid-two">
                <label>First name<input name="firstName" required /></label>
                <label>Last name<input name="lastName" required /></label>
              </div>
            )}
            <label>Email<input name="email" type="email" required /></label>
            <label>Password<input name="password" type="password" minLength="8" required /></label>
            {notice && <p className="notice">{notice}</p>}
            <button className="primary" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register'}</button>
          </form>

          <button className="link-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice('') }}>
            {mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}
          </button>
        </section>
      </main>
    )
  }

  const selected = accounts.find(account => account.id === selectedAccount)

  return (
    <main className="dashboard">
      <aside>
        <div className="brand">BS</div>
        <h2>BankSphere</h2>
        <div className="profile">
          <span>{user?.first_name?.[0] || 'U'}</span>
          <div><strong>{user?.first_name} {user?.last_name}</strong><small>{user?.email}</small></div>
        </div>
        <button className="logout" onClick={logout}>Sign out</button>
      </aside>

      <section className="content">
        <header>
          <div><p className="eyebrow">DASHBOARD</p><h1>Good to see you</h1></div>
        </header>

        {notice && <p className="notice">{notice}</p>}

        <div className="balance-grid">
          <article className="balance-card">
            <p>Available balance</p>
            <h2>${Number(selected?.balance || 0).toFixed(2)}</h2>
            <small>{selected?.account_number || 'No account selected'}</small>
          </article>
          {accounts.length > 1 && (
            <label className="account-select">Selected account
              <select value={selectedAccount} onChange={(event) => setSelectedAccount(event.target.value)}>
                {accounts.map(account => <option key={account.id} value={account.id}>{account.account_number}</option>)}
              </select>
            </label>
          )}
        </div>

        <section className="panel-grid">
          <article className="panel">
            <h3>Create account</h3>
            <form onSubmit={createAccount} className="form compact">
              <label>Account number<input name="accountNumber" placeholder="ACC123456789" required /></label>
              <label>Account type
                <select name="accountType"><option>SAVINGS</option><option>CHECKING</option></select>
              </label>
              <button className="primary" disabled={busy}>Create account</button>
            </form>
          </article>

          <article className="panel">
            <h3>Deposit</h3>
            <form onSubmit={(event) => submitMoney(event, 'DEPOSIT')} className="form compact">
              <label>Amount<input name="amount" type="number" min="0.01" step="0.01" required /></label>
              <label>Description<input name="description" placeholder="Initial deposit" /></label>
              <button className="primary" disabled={busy || !selectedAccount}>Deposit</button>
            </form>
          </article>

          <article className="panel">
            <h3>Withdrawal</h3>
            <form onSubmit={(event) => submitMoney(event, 'WITHDRAWAL')} className="form compact">
              <label>Amount<input name="amount" type="number" min="0.01" step="0.01" required /></label>
              <label>Description<input name="description" placeholder="Cash withdrawal" /></label>
              <button className="primary" disabled={busy || !selectedAccount}>Withdraw</button>
            </form>
          </article>

          <article className="panel">
            <h3>Transfer</h3>
            <form onSubmit={transfer} className="form compact">
              <label>Destination account ID<input name="toAccountId" required /></label>
              <label>Amount<input name="amount" type="number" min="0.01" step="0.01" required /></label>
              <label>Description<input name="description" placeholder="Transfer" /></label>
              <button className="primary" disabled={busy || !selectedAccount}>Transfer</button>
            </form>
          </article>
        </section>

        <article className="panel history">
          <h3>Transactions</h3>
          {transactions.length === 0 ? <p className="muted">No transactions yet.</p> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Type</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.transaction_type}</td>
                      <td>{transaction.description || '-'}</td>
                      <td>${Number(transaction.amount).toFixed(2)}</td>
                      <td>{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
