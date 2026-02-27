import React, { useState } from 'react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/contact', form);
            toast.success("Message sent! We'll get back to you soon.");
            setForm({ name: '', email: '', message: '' });
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="contact-page" style={{ padding: '80px 24px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="contact-page-wrap" style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '40px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>

                {/* Left Side: Contact Info */}
                <div style={{ flex: '1 1 400px', background: 'linear-gradient(145deg, #CC0000 0%, #990000 100%)', color: '#fff', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Get in Touch</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '50px' }}>
                            Whether you're looking for a custom demo, have questions about pricing, or need technical support, our team is ready to help you optimize your workforce.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0' }}>Corporate Office</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>Rudrapur, Udham Singh Nagar District<br />Uttarakhand, India</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0' }}>Phone Support</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '1.05rem', fontWeight: 500 }}>9058065003</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0' }}>Email Us</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '1.05rem', fontWeight: 500 }}>vaibhavbhatt145@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Response Time: Under 24 Business Hours</p>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="contact-page-card" style={{ flex: '1 1 500px', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Send us a Message</h3>
                    <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '1.05rem' }}>Fill out the form below and we will contact you shortly.</p>

                    <form onSubmit={onSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div className="contact-form-group" style={{ position: 'relative' }}>
                            <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: focusedField === 'name' ? '#CC0000' : '#374151', marginBottom: '8px', transition: 'color 0.2s' }}>Full Name</label>
                            <input
                                id="contact-name" name="name" value={form.name} onChange={onChange} placeholder="John Doe" required
                                className="form-input"
                                style={{ padding: '14px 16px', fontSize: '1rem', borderRadius: '12px', border: focusedField === 'name' ? '2px solid #CC0000' : '2px solid #EEF0F3', outline: 'none', width: '100%', transition: 'all 0.2s', backgroundColor: '#FAFAFA' }}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>

                        <div className="contact-form-group" style={{ position: 'relative' }}>
                            <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: focusedField === 'email' ? '#CC0000' : '#374151', marginBottom: '8px', transition: 'color 0.2s' }}>Email Address</label>
                            <input
                                id="contact-email" name="email" type="email" value={form.email} onChange={onChange} placeholder="john@company.com" required
                                className="form-input"
                                style={{ padding: '14px 16px', fontSize: '1rem', borderRadius: '12px', border: focusedField === 'email' ? '2px solid #CC0000' : '2px solid #EEF0F3', outline: 'none', width: '100%', transition: 'all 0.2s', backgroundColor: '#FAFAFA' }}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>

                        <div className="contact-form-group" style={{ position: 'relative' }}>
                            <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: focusedField === 'message' ? '#CC0000' : '#374151', marginBottom: '8px', transition: 'color 0.2s' }}>How can we help?</label>
                            <textarea
                                id="contact-message" name="message" value={form.message} onChange={onChange} placeholder="Tell us about your requirements..." rows={5} required
                                className="form-input"
                                style={{ padding: '16px', fontSize: '1rem', borderRadius: '12px', border: focusedField === 'message' ? '2px solid #CC0000' : '2px solid #EEF0F3', outline: 'none', width: '100%', transition: 'all 0.2s', resize: 'vertical', backgroundColor: '#FAFAFA' }}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            style={{
                                marginTop: '10px',
                                backgroundColor: sending ? '#9CA3AF' : '#CC0000',
                                color: '#fff',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: sending ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: sending ? 'none' : '0 8px 16px rgba(204, 0, 0, 0.2)',
                                transform: sending ? 'none' : 'translateY(0)'
                            }}
                            onMouseOver={e => {
                                if (!sending) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(204, 0, 0, 0.3)';
                                }
                            }}
                            onMouseOut={e => {
                                if (!sending) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(204, 0, 0, 0.2)';
                                }
                            }}
                        >
                            {sending ? 'Sending Message...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
