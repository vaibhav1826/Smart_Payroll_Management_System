import React, { useState, useEffect, useRef } from 'react'
import GalaxyBackground from '../components/GalaxyBackground'

export default function Home({ setPage }) {
  const [stats, setStats] = useState({ employees: 0, accuracy: 0 })
  const [visible, setVisible] = useState({ problem: false, workflow: true, cta: false })
  const problemRef = useRef(null)
  const workflowRef = useRef(null)
  const ctaRef = useRef(null)

  const workflowSteps = [
    'Contractor creates company',
    'Supervisors assigned',
    'Employees register under supervisor',
    'Attendance marked by employees',
    'Payroll auto-calculated',
    'Salary slips generated',
  ]

  useEffect(() => {
    const duration = 2000
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step++
      const t = step / steps
      setStats({
        employees: Math.round(10000 * t),
        accuracy: (99.9 * t).toFixed(1),
      })
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const name = entry.target.dataset.section
            if (name) setVisible((v) => ({ ...v, [name]: true }))
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    )
    const refs = [problemRef, workflowRef, ctaRef]
    const timer = setTimeout(() => {
      refs.forEach((ref) => {
        if (ref.current) observer.observe(ref.current)
      })
    }, 0)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const handleNav = (e, pageName) => {
    e.preventDefault()
    if (setPage) setPage(pageName)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="landing">
      <section className="landing-hero">
        <GalaxyBackground />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-inner">
          <h1 className="landing-hero-title landing-anim-fade-up">
            Smart Payroll & Employee Management System
          </h1>
          <p className="landing-hero-sub landing-anim-fade-up landing-anim-delay-1">
            Automate Payroll, Attendance & Workforce Management — All in One Platform.
          </p>
          <p className="landing-hero-tagline landing-anim-fade-up landing-anim-delay-2">
            Secure • Scalable • Industry-Ready
          </p>
          <div className="landing-hero-buttons landing-anim-fade-up landing-anim-delay-3">
            <button type="button" className="landing-btn landing-btn-primary" onClick={(e) => handleNav(e, 'contact')}>
              Get Started
            </button>
          </div>
          <div className="landing-hero-stats landing-anim-fade-up landing-anim-delay-4">
            <div className="landing-stat">
              <span className="landing-stat-value">{stats.employees.toLocaleString()}+</span>
              <span className="landing-stat-label">Employees Managed</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-value">{stats.accuracy}%</span>
              <span className="landing-stat-label">Payroll Accuracy</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-value landing-stat-pulse">Real-Time</span>
              <span className="landing-stat-label">Attendance Tracking</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt" ref={problemRef} data-section="problem">
        <div className="landing-container">
          <h2 className={`landing-heading ${visible.problem ? 'landing-anim-in' : ''}`}>
            Why Businesses Struggle with Traditional Payroll Systems?
          </h2>
          <div className="landing-problem-grid">
            {[
              { title: 'Manual Salary Calculations', desc: 'Time-consuming and error-prone' },
              { title: 'Attendance Errors', desc: 'Manual logs lead to disputes' },
              { title: 'Excel-Based Payroll Risks', desc: 'Formulas break, data gets corrupted' },
              { title: 'Paper-Based Documentation', desc: 'Hard to audit and scale' },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`landing-problem-card ${visible.problem ? 'landing-anim-in' : ''}`}
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <span className="landing-problem-icon">{item.title}</span>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <p className={`landing-problem-cta ${visible.problem ? 'landing-anim-in' : ''}`} style={{ animationDelay: '0.45s' }}>
            Our Smart Payroll System eliminates errors and automates everything.
          </p>
        </div>
      </section>

      <section className="landing-section landing-section-workflow" ref={workflowRef} data-section="workflow">
        <div className="landing-container">
          <h2 className={`landing-heading ${visible.workflow ? 'landing-anim-in' : ''}`}>
            How It Works
          </h2>
          <p className="landing-workflow-intro">
            Contractors create companies — then supervisors, employees, and payroll flow from there.
          </p>
          <div className="landing-workflow">
            {workflowSteps.map((label, i) => (
              <React.Fragment key={label}>
                <div
                  className={`landing-workflow-step ${visible.workflow ? 'landing-anim-in' : ''}`}
                  style={{ animationDelay: `${0.08 * i}s` }}
                >
                  <span className="landing-workflow-num">{i + 1}</span>
                  {label}
                </div>
                {i < workflowSteps.length - 1 && (
                  <span className={`landing-workflow-line ${visible.workflow ? 'landing-line-draw' : ''}`} style={{ animationDelay: `${0.08 * i + 0.05}s` }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta" ref={ctaRef} data-section="cta">
        <div className="landing-cta-accent" />
        <div className="landing-container">
          <h2 className={`landing-cta-title ${visible.cta ? 'landing-anim-in' : ''}`}>
            Ready to Automate Your Workforce?
          </h2>
          <p className={`landing-cta-sub ${visible.cta ? 'landing-anim-in' : ''}`} style={{ animationDelay: '0.1s' }}>
            Trusted by industries for payroll, attendance, and workforce management. Get in touch today.
          </p>
          <div className={`landing-cta-buttons ${visible.cta ? 'landing-anim-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            <button type="button" className="landing-btn landing-btn-primary landing-btn-glow" onClick={(e) => handleNav(e, 'contact')}>
              Start Free Trial
            </button>
            <button type="button" className="landing-btn landing-btn-outline landing-cta-outline" onClick={(e) => handleNav(e, 'contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
