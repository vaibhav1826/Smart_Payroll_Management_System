import React from 'react'
import Logo from '../components/Logo'

export default function Dashboard({ setPage, user }) {
  const handleNav = (e, pageName) => {
    e.preventDefault()
    if (setPage) setPage(pageName)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Logo width={48} height={48} />
        <div className="dashboard-header-text">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-welcome">
            Welcome back{user?.name ? `, ${user.name}` : user?.email ? ` (${user.email})` : ''}.
          </p>
        </div>
      </div>
      <section className="dashboard-section">
        <p className="dashboard-intro">
          You are logged in. Use the navigation above to visit Home, About, or Contact, or log out when you are done.
        </p>
        <div className="dashboard-actions">
          <button type="button" className="landing-btn landing-btn-primary" onClick={(e) => handleNav(e, 'home')}>
            Go to Home
          </button>
          <button type="button" className="landing-btn landing-btn-outline" onClick={(e) => handleNav(e, 'about')}>
            About
          </button>
        </div>
      </section>
    </div>
  )
}
