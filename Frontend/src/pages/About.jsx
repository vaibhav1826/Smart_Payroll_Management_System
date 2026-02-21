import React from 'react'
import Logo from '../components/Logo'

export default function About({ setPage }) {
  const handleNav = (e, pageName) => {
    e.preventDefault()
    if (setPage) setPage(pageName)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="about-page">
      <div className="about-brand">
        <Logo width={56} height={56} />
        <div className="about-brand-text">
          <h1 className="about-title">About Shiv Enterprises</h1>
          <p className="about-tagline">Our enterprise — quality, trust, and excellence in everything we do.</p>
        </div>
      </div>

      <section className="about-section">
        <h2 className="about-heading">Who We Are</h2>
        <p className="about-lead">
          <strong>Shiv Enterprises</strong> is our enterprise. This website is our home on the web: it represents who we are, what we offer, and how we work with our clients and partners.
        </p>
        <p className="about-p">
          We believe in excellence in every endeavor and in building trust through quality and innovation. Whether you are looking for our services, want to know more about us, or wish to get in touch, you are in the right place.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-heading">What We Do</h2>
        <p className="about-p">
          Our work is built on a clear focus on quality and reliability:
        </p>
        <ul className="about-flow-list">
          <li><strong>Our team</strong> is structured so that we can serve you efficiently — with clear roles and accountability.</li>
          <li><strong>Processes</strong> are designed to track work, manage time, and deliver results you can count on.</li>
          <li><strong>Transparency</strong> matters to us: we keep things organized so that reporting and communication stay simple.</li>
          <li><strong>Growth</strong> is part of our vision — we aim to scale our capabilities while keeping the same standards.</li>
        </ul>
        <p className="about-p">
          For authorized users, we use secure login and session management so that only invited team members and partners can access our internal tools. Your data and our operations stay protected.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-heading">Our Values</h2>
        <div className="about-feature-grid">
          <div className="about-feature-card">
            <h3 className="about-feature-title">Quality</h3>
            <ul className="about-feature-list">
              <li>We deliver work we are proud of</li>
              <li>Consistent standards in every project</li>
              <li>Attention to detail and reliability</li>
            </ul>
          </div>
          <div className="about-feature-card">
            <h3 className="about-feature-title">Trust</h3>
            <ul className="about-feature-list">
              <li>Building long-term relationships</li>
              <li>Honest communication and timelines</li>
              <li>Confidentiality and professionalism</li>
            </ul>
          </div>
          <div className="about-feature-card">
            <h3 className="about-feature-title">Innovation</h3>
            <ul className="about-feature-list">
              <li>Improving how we work</li>
              <li>Using technology where it helps</li>
              <li>Staying adaptable and forward-looking</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-heading">Get in Touch</h2>
        <p className="about-p">
          We would be glad to hear from you. Use the Contact page to send a message, ask a question, or start a conversation. We treat every inquiry with care and respond as soon as we can.
        </p>
      </section>

      <section className="about-cta">
        <h2 className="about-cta-title">Ready to Connect?</h2>
        <p className="about-cta-text">
          Whether you have a project in mind or simply want to know more about Shiv Enterprises, reach out — we are here to help.
        </p>
        <div className="about-cta-buttons">
          <button type="button" className="landing-btn landing-btn-primary" onClick={(e) => handleNav(e, 'contact')}>
            Contact Us
          </button>
          <button type="button" className="landing-btn landing-btn-outline about-cta-outline" onClick={(e) => handleNav(e, 'home')}>
            Back to Home
          </button>
        </div>
      </section>
    </div>
  )
}
