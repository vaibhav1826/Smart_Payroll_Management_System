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
                    <p className="about-tagline" style={{ fontSize: '1.25rem', color: '#6B7280', maxWidth: '700px', margin: '0 auto' }}>
                        Your Trusted Partner in Professional Manpower, Contracting, and Comprehensive Workforce Solutions.
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
                        <strong style={{ color: '#CC0000' }}>Shiv Enterprises</strong> is a premier manpower supplier and contracting firm based in Uttarakhand, India. With years of deep industry expertise, we specialize in providing highly skilled, semi-skilled, and unskilled labor forces tailored to meet the dynamic needs of modern industries, manufacturing units, and corporate sectors.
                    </p>
                    <p className="about-lead" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#374151', margin: 0 }}>
                        We don't just supply human resources; we provide complete workforce management ecosystems. From ensuring strict compliance with labor laws to managing intricate payrolls and attendance tracking, we handle the entire lifecycle of contractor management. Our mission is to allow our clients to focus purely on their core business growth while we guarantee a reliable, efficient, and well-managed workforce foundation.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Split */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                <div style={{ backgroundColor: '#FAFAFA', padding: '40px', borderRadius: '20px', borderTop: '4px solid #CC0000', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Our Mission</h3>
                    <p style={{ color: '#4B5563', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                        To deliver unparalleled, compliant, and highly efficient manpower services that seamlessly integrate into our clients' operational frameworks. We strive to uplift the workforce by providing fair opportunities, timely compensation, and a safe technological platform.
                    </p>
                </div>
                <div style={{ backgroundColor: '#FAFAFA', padding: '40px', borderRadius: '20px', borderTop: '4px solid #111827', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Our Vision</h3>
                    <p style={{ color: '#4B5563', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                        To become India's most trusted, transparent, and digitally-empowered contracting enterprise—setting new industry standards in workforce reliability, labor compliance, and comprehensive HR management technology.
                    </p>
                </div>
            </div>

            {/* Features/Capabilities Section */}
            <section className="about-section" style={{ marginBottom: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 className="about-heading" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827' }}>Our Core Services</h2>
                    <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Comprehensive solutions designed for enterprise scalability and peace of mind.</p>
                </div>

                <div className="about-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {[
                        {
                            title: 'Skilled Manpower Supply',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
                            desc: 'Providing vetted, reliable, and highly trained personnel exactly matched to your industry requirements.',
                            list: ['Manufacturing & Production Staff', 'Warehouse & Logistics Personnel', 'Corporate Support Staff', 'Temporary & Permanent Placement']
                        },
                        {
                            title: 'Complete Compliance Management',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
                            desc: 'We take full responsibility for labor laws, statutory requirements, and rigorous documentation.',
                            list: ['PF, ESI, & PT Management', 'Factory Act Compliance', 'Contract Labor Regulation (CLRA)', 'Regular Audit Readiness']
                        },
                        {
                            title: 'Digital Payroll & Attendance',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
                            desc: 'Leveraging our proprietary enterprise platform to guarantee flawless, on-time salary disbursements.',
                            list: ['1-Click automated payroll', 'Biometric & Geo-fenced attendance', 'Detailed transparent salary slips', 'Automated shift & overtime computation']
                        },
                        {
                            title: 'On-Site Supervisor Coordination',
                            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
                            desc: 'Dedicated field supervisors deployed directly at your facility to monitor operations and resolve issues instantly.',
                            list: ['Daily resource tracking', 'Performance monitoring', 'Grievance handling', 'Direct liaison with client management']
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
                <h2 className="about-cta-title" style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '20px', color: '#fff', position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>Partner with Industry Experts</h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', position: 'relative', zIndex: 1 }}>Experience hassle-free workforce management. We handle the complexities so you can focus entirely on scaling your core business.</p>
                <div className="about-cta-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => navigate('/contact')} style={{ backgroundColor: '#fff', color: '#CC0000', border: 'none', padding: '14px 32px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}>Discuss Your Requirements</button>
                    <button type="button" onClick={() => navigate('/')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', padding: '12px 32px', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>Home Page</button>
                </div>
            </section >
        </div >
    );
}
