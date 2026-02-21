import React, { useState, useEffect, useRef, useCallback } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Logo from './components/Logo'
import Footer from './components/Footer'
import InactivityModal from './components/InactivityModal'

const INACTIVITY_MS = 30 * 60 * 1000 // 30 minutes

export default function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [showInactivityModal, setShowInactivityModal] = useState(false)
  const inactivityTimerRef = useRef(null)

  const resetInactivityTimer = useCallback(() => {
    if (!user) return
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityModal(true)
    }, INACTIVITY_MS)
  }, [user])

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.ok && data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user && page === 'dashboard') setPage('home')
  }, [user, page])

  useEffect(() => {
    if (!user) return
    resetInactivityTimer()
    const onActivity = () => resetInactivityTimer()
    window.addEventListener('mousemove', onActivity)
    window.addEventListener('keydown', onActivity)
    window.addEventListener('click', onActivity)
    return () => {
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('keydown', onActivity)
      window.removeEventListener('click', onActivity)
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    }
  }, [user, resetInactivityTimer])

  const handleInactivityContinue = () => {
    fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          if (data.user) setUser(data.user)
          setShowInactivityModal(false)
          resetInactivityTimer()
        }
      })
      .catch(() => setShowInactivityModal(false))
  }

  const handleInactivityLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
    setShowInactivityModal(false)
    setPage('login')
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
  }

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
    setPage('home')
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand" onClick={() => setPage('home')}>
          <Logo width={60} height={60} />
          <div className="company-name">Shiv Enterprises</div>
        </div>
        <nav className="nav-menu">
          <button
            className={`nav-button ${page === 'home' ? 'active' : ''}`}
            onClick={() => setPage('home')}
          >
            Home
          </button>
          <button
            className={`nav-button ${page === 'about' ? 'active' : ''}`}
            onClick={() => setPage('about')}
          >
            About
          </button>
          <button
            className={`nav-button ${page === 'contact' ? 'active' : ''}`}
            onClick={() => setPage('contact')}
          >
            Contact
          </button>
          {user && (
            <button
              className={`nav-button ${page === 'dashboard' ? 'active' : ''}`}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
          )}
          {user ? (
            <button type="button" className="nav-button nav-login" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="nav-button nav-login"
              onClick={() => setPage('login')}
              aria-label="Login"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'about' && <About setPage={setPage} />}
        {page === 'contact' && <Contact />}
        {page === 'login' && <Login setPage={setPage} setUser={setUser} />}
        {page === 'dashboard' && user && <Dashboard setPage={setPage} user={user} />}
      </main>
      <Footer setPage={setPage} />

      {showInactivityModal && (
        <InactivityModal onContinue={handleInactivityContinue} onLogout={handleInactivityLogout} />
      )}
    </div>
  )
}
