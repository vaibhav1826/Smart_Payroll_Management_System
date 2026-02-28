import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="about-page" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>

            {/* Header Section */}
            <div className="about-brand" style={{ textAlign: 'center', marginBottom: '80px' }}>
                <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '24px', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
                    <Logo width={80} height={80} />
                </div>
                <div className="about-brand-text">
                    <h1 className="about-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: '#111827', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                        About <span style={{ color: '#CC0000' }}>Shiv Enterprises</span>
                    </h1>
                    <p className="about-tagline" style={{ fontSize: '1.25rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
                        Empowering Indian businesses with modern, scalable, and secure workforce management solutions.
                    </p>
                </div>
            </div>

            {/* Main Mission Section */}
            <section className="about-section" style={{ marginBottom: '60px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', padding: '50px', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '4px', background: '#CC0000', borderRadius: '2px' }}></div>
                        <h2 className="about-heading" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Who We Are</h2>
                    </div>
                    <p className="about-lead" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#374151', margin: 0 }}>
                        <strong>Shiv Enterprises</strong> is a premier enterprise-grade workforce management platform dedicated to simplifying complex HR operations. Built on the pillars of transparency, accuracy, and true scalability, our software is designed to handle the intricate payroll and attendance needs of modern businesses. We provide an integrated ecosystem where administrators, supervisors, and employees can collaborate seamlessly—eliminating manual errors and ensuring your workforce is paid accurately and on time, every time.
                    </p>
                </div>
            </section>

            {/* Features/Capabilities Section */}
            <section className="about-section" style={{ marginBottom: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 className="about-heading" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827' }}>Our Core Capabilities</h2>
                    <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Everything you need to manage your organization efficiently.</p>
                </div>

                <div className="about-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {[
                        {
                            title: 'Intelligent Payroll Engine',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
                            desc: 'End-to-end automated calculations reducing manual errors and saving days of processing time.',
                            list: ['Industry-wise salary structures', 'Automated tax & compliance', '1-Click PDF salary slips', 'Bank disbursement ready']
                        },
                        {
                            title: 'Advanced Time Tracking',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
                            desc: 'Crystal-clear, real-time visibility into your entire workforce presence and productivity.',
                            list: ['Geo-fenced daily marking', 'Shift and roster management', 'Overtime & late mark computation', 'Bulk entry support']
                        },
                        {
                            title: 'Workflow Automation',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>,
                            desc: 'Streamlined approval matrices connecting employees directly with decision-makers.',
                            list: ['Multi-level approval workflows', 'Real-time leave balances', 'Auto-sync with payroll', 'Holiday calendar mapping']
                        },
                        {
                            title: 'Enterprise Architecture',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path></svg>,
                            desc: 'Secure, multi-tenant infrastructure built for complex hierarchies and large teams.',
                            list: ['Robust Role-Based Access', 'Department & Branch mapping', 'Enterprise-level billing', 'Complete audit logs & security']
                        }
                    ].map(({ title, icon, desc, list }) => (
                        <div key={title} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '40px 30px',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                            border: '1px solid rgba(221, 225, 231, 0.5)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(204, 0, 0, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(204, 0, 0, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(221, 225, 231, 0.5)';
                            }}>
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'rgba(204,0,0,0.05)', borderRadius: '16px' }}>
                                {icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{title}</h3>
                            <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '24px', lineHeight: '1.6' }}>{desc}</p>

                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, borderTop: '1px solid #EEF0F3', paddingTop: '20px' }}>
                                {list.map(l => (
                                    <li key={l} style={{ position: 'relative', paddingLeft: '28px', marginBottom: '12px', fontSize: '0.95rem', color: '#374151', fontWeight: 500 }}>
                                        <span style={{ position: 'absolute', left: 0, top: '2px', color: '#CC0000', backgroundColor: 'rgba(204,0,0,0.1)', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '10px' }}>✓</span>
                                        {l}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section >

            {/* Call to Action */}
            < section className="about-cta" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #CC0000 0%, #990000 100%)', padding: '60px 40px', borderRadius: '24px', color: '#fff', boxShadow: '0 20px 40px rgba(204, 0, 0, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '150%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                <h2 className="about-cta-title" style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '20px', color: '#fff', position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>Ready to Modernize Your Operations?</h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', position: 'relative', zIndex: 1 }}>Join hundreds of organizations securely managing their workforce on the Shiv Enterprises platform today.</p>
                <div className="about-cta-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => navigate('/contact')} style={{ backgroundColor: '#fff', color: '#CC0000', border: 'none', padding: '14px 32px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}>Contact Sales</button>
                    <button type="button" onClick={() => navigate('/')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', padding: '12px 32px', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>Return Home</button>
                </div>
            </section >
        </div >
    );
}
