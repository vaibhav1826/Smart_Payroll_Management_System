import React from 'react'

const INACTIVITY_MSG = "You've been inactive for a while. Do you want to continue working or log out?"

export default function InactivityModal({ onContinue, onLogout }) {
  return (
    <div className="inactivity-overlay" role="dialog" aria-modal="true" aria-labelledby="inactivity-title">
      <div className="inactivity-modal">
        <h2 id="inactivity-title" className="inactivity-title">Session timeout</h2>
        <p className="inactivity-text">{INACTIVITY_MSG}</p>
        <div className="inactivity-buttons">
          <button type="button" className="landing-btn landing-btn-primary" onClick={onContinue}>
            Continue working
          </button>
          <button type="button" className="landing-btn landing-btn-outline inactivity-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
