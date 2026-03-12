import React, { useState } from 'react'
import Logo from '../components/Logo'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await resp.json()
      setStatus(data?.ok ? 'Sent!' : 'Error')
    } catch {
      setStatus('Error')
    }
  }

  return (
    <section className="contact-page">
      <div className="contact-page-wrap">
        <header className="contact-page-brand">
          <Logo width={72} height={72} />
          <div className="contact-page-brand-text">
            <h2>Contact Us</h2>
            <p>Get in touch for demos, pricing, or support. We're here to help.</p>
          </div>
        </header>
        <div className="contact-page-card">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message or question..."
                rows={5}
                required
              />
            </div>
            <button type="submit" className="contact-form-submit">
              Send Message
            </button>
          </form>
          {status && (
            <p className={`contact-status ${status === 'Sent!' ? 'contact-status-success' : 'contact-status-error'}`}>
              {status === 'Sent!' ? "Message sent. We'll get back to you soon." : 'Something went wrong. Please try again.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
