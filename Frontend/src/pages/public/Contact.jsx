import React, { useState } from 'react'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sending, setSending] = useState(false)

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            await api.post('/contact', form)
            toast.success("Message sent! We'll get back to you soon.")
            setForm({ name: '', email: '', message: '' })
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <section className="contact-page">
            <div className="contact-page-wrap">
                <header className="contact-page-brand">
                    <div className="contact-page-brand-text">
                        <h2>Contact Us</h2>
                        <p>Get in touch for demos, pricing, or support. We're here to help.</p>
                    </div>
                </header>
                <div className="contact-page-card">
                    <form onSubmit={onSubmit} className="contact-form">
                        <div className="contact-form-group">
                            <label htmlFor="contact-name">Name</label>
                            <input id="contact-name" name="name" value={form.name} onChange={onChange} placeholder="Your name" required className="form-input" />
                        </div>
                        <div className="contact-form-group">
                            <label htmlFor="contact-email">Email</label>
                            <input id="contact-email" name="email" type="email" value={form.email} onChange={onChange} placeholder="your@email.com" required className="form-input" />
                        </div>
                        <div className="contact-form-group">
                            <label htmlFor="contact-message">Message</label>
                            <textarea id="contact-message" name="message" value={form.message} onChange={onChange} placeholder="Your message..." rows={5} required className="form-input" />
                        </div>
                        <button type="submit" className="btn btn-primary contact-form-submit" disabled={sending}>
                            {sending ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
