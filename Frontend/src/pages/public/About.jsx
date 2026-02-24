import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'

export default function About() {
    const navigate = useNavigate()
    return (
        <div className="about-page">
            <div className="about-brand">
                <Logo width={56} height={56} />
                <div className="about-brand-text">
                    <h1 className="about-title">About Shiv Enterprises</h1>
                    <p className="about-tagline">Quality, trust, and excellence in everything we do.</p>
                </div>
            </div>
            <section className="about-section">
                <h2 className="about-heading">Who We Are</h2>
                <p className="about-lead"><strong>Shiv Enterprises</strong> is an enterprise-grade workforce management company built on quality, transparency, and scalability. Our integrated payroll platform serves contractors, supervisors, and employees seamlessly.</p>
            </section>
            <section className="about-section">
                <h2 className="about-heading">What We Do</h2>
                <div className="about-feature-grid">
                    {[
                        { title: 'Payroll Automation', list: ['Industry-wise salary structures', 'Auto-calculation & locking', 'PDF salary slip generation'] },
                        { title: 'Attendance Tracking', list: ['Real-time daily marking', 'Bulk entry support', 'Overtime computation'] },
                        { title: 'Leave Management', list: ['Apply, approve, reject flows', 'Leave balance tracking', 'Payroll integration'] },
                    ].map(({ title, list }) => (
                        <div key={title} className="about-feature-card">
                            <h3 className="about-feature-title">{title}</h3>
                            <ul className="about-feature-list">{list.map(l => <li key={l}>{l}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </section>
            <section className="about-cta">
                <h2 className="about-cta-title">Ready to Connect?</h2>
                <div className="about-cta-buttons">
                    <button type="button" className="landing-btn landing-btn-primary" onClick={() => navigate('/contact')}>Contact Us</button>
                    <button type="button" className="landing-btn landing-btn-outline" onClick={() => navigate('/')}>Back to Home</button>
                </div>
            </section>
        </div>
    )
}
