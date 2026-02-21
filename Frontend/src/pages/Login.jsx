import React, { useState } from 'react'
import Logo from '../components/Logo'

export default function Login({ setPage, setUser }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Please enter email and password.')
      return
    }
    setError(null)
    setLoading(true)
    fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email.trim(), password: form.password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user)
          setPage('dashboard')
        } else {
          setError(data.message || 'Login failed.')
        }
      })
      .catch(() => setError('Unable to reach server. Try again.'))
      .finally(() => setLoading(false))
  }

  return (
    <section className="login-page">
      <div className="login-page-wrap">
        <header className="login-page-brand">
          <Logo width={64} height={64} />
          <div className="login-page-brand-text">
            <h2>Login</h2>
            <p>Sign in with your allowed account to continue.</p>
          </div>
        </header>
        <div className="login-page-card">
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}
            <div className="login-form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="login-form-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="login-back">
            <button
              type="button"
              className="login-back-btn"
              onClick={() => setPage && setPage('home')}
            >
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
