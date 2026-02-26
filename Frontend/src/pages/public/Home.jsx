import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Hero3DBackground from '../../components/public/Hero3DBackground';
const PROBLEMS = [
    { title: 'Manual Salary Calculations', desc: 'Time-consuming, error-prone calculations that cause disputes.' },
    { title: 'Attendance Discrepancies', desc: 'Manual logs lead to inaccurate pay and employee grievances.' },
    { title: 'Excel-Based Payroll Risks', desc: 'Formulas break, files get corrupted, no audit trail.' },
    { title: 'Compliance & Audit Gaps', desc: 'Paper-based records are hard to audit, retrieve, or scale.' },
];

export default function Home() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [stats, setStats] = useState({ employees: 0, accuracy: 0, companies: 0 });
    const [visible, setVisible] = useState({ problem: false, cta: false, features: false });
    const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | null
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '', role: 'employee', secretKey: '' });
    const [loading, setLoading] = useState(false);

    const problemRef = useRef(null);
    const ctaRef = useRef(null);
    const featuresRef = useRef(null);
    const authRef = useRef(null);

    // Counter animation
    useEffect(() => {
        const steps = 60; let step = 0;
        const timer = setInterval(() => {
            step++;
            const t = step / steps;
            setStats({ employees: Math.round(10000 * t), accuracy: (99.9 * t).toFixed(1), companies: Math.round(250 * t) });
            if (step >= steps) clearInterval(timer);
        }, 2000 / steps);
        return () => clearInterval(timer);
    }, []);

    // Scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    const name = e.target.dataset.section;
                    if (name) setVisible(v => ({ ...v, [name]: true }));
                }
            }),
            { threshold: 0.1 }
        );
        [problemRef, ctaRef, featuresRef, authRef].forEach(r => { if (r.current) observer.observe(r.current); });
        return () => observer.disconnect();
    }, []);

    const onAuthChange = e => setAuthForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onAuthSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (authMode === 'login') {
                if (!authForm.email || !authForm.password) return toast.error('Email and password required.');
                const user = await login(authForm.email, authForm.password);
                toast.success(`Welcome back, ${user.name}!`);
                navigate('/dashboard');
            } else if (authMode === 'register') {
                if (!authForm.secretKey) return toast.error('Secret Key is required.');
                if (!authForm.name || !authForm.email || !authForm.password) return toast.error('Name, email and password required.');
                if (authForm.password.length < 6) return toast.error('Password must be at least 6 characters.');
                const user = await register(authForm);
                toast.success(`Account created! Welcome, ${user.name}.`);
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing">

            {/* ── Hero ── */}
            <section className="landing-hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                {/* Embedded Interactive 3D Background */}
                <Hero3DBackground />
                
                <div className="landing-hero-inner" style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                    {/* Hero Text Content */}
                    <div>
                        <div className="landing-hero-badge">Payroll &amp; Workforce Management</div>
                        <h1 className="landing-hero-title landing-anim-fade-up">
                            Smarter Payroll.<br />
                            <span>Stronger Workforce.</span>
                        </h1>
                        <p className="landing-hero-sub landing-anim-fade-up landing-anim-delay-1" style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>
                            Automate attendance, leaves, and salary — all in one secure platform built for Indian businesses.
                            From smart shift planning to enterprise-level security.
                        </p>

                        {!authMode && (
                            <div className="landing-hero-buttons landing-anim-fade-up landing-anim-delay-2" style={{ display: 'flex', gap: '1rem' }}>
                                <button className="landing-btn landing-btn-primary" onClick={() => setAuthMode('login')}>
                                    Sign In
                                </button>
                                <button className="landing-btn landing-btn-outline" onClick={() => setAuthMode('register')}>
                                    Create Account
                                </button>
                            </div>
                        )}

                        <div className="landing-hero-stats landing-anim-fade-up landing-anim-delay-3" style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                            <div className="landing-stat">
                                <span className="landing-stat-value">{stats.employees.toLocaleString()}+</span>
                                <span className="landing-stat-label">Employees Managed</span>
                            </div>
                            <div className="landing-stat-sep" style={{ width: '1px', background: '#e2e8f0' }} />
                            <div className="landing-stat">
                                <span className="landing-stat-value">{stats.accuracy}%</span>
                                <span className="landing-stat-label">Payroll Accuracy</span>
                            </div>
                        </div>
                    </div>

                    {/* Embedded Auth Panel */}
                    <div className="landing-anim-in" style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {!authMode ? (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Get Started</h3>
                                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Securely access the Shiv Enterprises Platform to manage your workforce, operations, and finances.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <button className="landing-btn landing-btn-primary" onClick={() => setAuthMode('login')} style={{ width: '100%', justifyContent: 'center' }}>Sign In to Dashboard</button>
                                    <button className="landing-btn landing-btn-outline" onClick={() => setAuthMode('register')} style={{ width: '100%', justifyContent: 'center' }}>Register New Entity</button>
                                </div>
                            </div>
                        ) : (
                            <div ref={authRef} data-section="auth">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a' }}>
                                        {authMode === 'login' ? 'Sign In' : 'Create Account'}
                                    </h3>
                                    <button onClick={() => setAuthMode(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>✕ Close</button>
                                </div>
                                <form onSubmit={onAuthSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {authMode === 'register' && (
                                        <div className="form-field">
                                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Secret Key (Required)</label>
                                            <input name="secretKey" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem' }} placeholder="Authorized Registration Key" value={authForm.secretKey} onChange={onAuthChange} required />
                                        </div>
                                    )}
                                    {authMode === 'register' && (
                                        <div className="form-field">
                                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Full Name</label>
                                            <input name="name" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem' }} placeholder="Your Name" value={authForm.name} onChange={onAuthChange} required />
                                        </div>
                                    )}
                                    <div className="form-field">
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                                        <input name="email" type="email" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem' }} placeholder="you@company.com" value={authForm.email} onChange={onAuthChange} required />
                                    </div>
                                    {authMode === 'register' && (
                                        <div className="form-field">
                                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Phone & Role</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input name="phone" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1 }} placeholder="Phone" value={authForm.phone} onChange={onAuthChange} />
                                                <select name="role" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem', width: '120px' }} value={authForm.role} onChange={onAuthChange}>
                                                    <option value="employee">Employee</option>
                                                    <option value="supervisor">Supervisor</option>
                                                    <option value="contractor">Contractor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-field">
                                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Password</label>
                                        <input name="password" type="password" className="form-input" style={{ padding: '0.75rem', fontSize: '0.9rem' }} placeholder="••••••••" value={authForm.password} onChange={onAuthChange} required />
                                    </div>
                                    <button type="submit" className="landing-btn landing-btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }}>
                                        {loading ? 'Processing...' : authMode === 'login' ? 'Sign In to Dashboard' : 'Register Account'}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                        {authMode === 'login' ? (
                                            <>Don't have an account? <span onClick={() => setAuthMode('register')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}>Register here</span></>
                                        ) : (
                                            <>Already have an account? <span onClick={() => setAuthMode('login')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}>Sign in here</span></>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* ── Architecture & Flowchart Features (About) ── */}
            <section className="landing-section landing-section-alt" ref={featuresRef} data-section="features">
                <div className="landing-container">
                    <p className="landing-section-eyebrow">Enterprise Architecture</p>
                    <h2 className={`landing-heading ${visible.features ? 'landing-anim-in' : ''}`}>
                        Advanced Systems & <span>Core Modules</span>
                    </h2>
                    <div className="landing-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {[
                            { title: 'Smart Rule Engine', desc: 'Powerful automation engine with custom APIs, dynamic shift rule conditions, automated compliance checks, and precise workflow triggers.' },
                            { title: 'Shift Planning & Workforce Scheduling', desc: 'Dynamic rostering capability ensuring operational efficiency, overtime management, and resource allocation mapping.' },
                            { title: 'Enterprise-Level Security Architecture', desc: 'Secure infrastructure handling user authentication, role-based access control (RBAC), data encryption, and audit trailing.' },
                            { title: 'Download Architecture', desc: 'Robust reporting system to generate standardized payslips, audit logs, formatting options, and bulk export capabilities.' },
                            { title: 'Bank Integration', desc: 'Direct salary disbursement via payment gateways, NEFT/RTGS formatting, and automated reconciliation.' },
                            { title: 'Document Management System', desc: 'Centralized repository for KyC docs, employee agreements, compliance certificates, with secure PII masking.' },
                        ].map((f, i) => (
                            <div key={f.title} className={`landing-feature-card ${visible.features ? 'landing-anim-in' : ''}`} style={{ animationDelay: `${0.1 * i}s` }}>
                                <div className="landing-feature-indicator" />
                                <h4 className="landing-feature-title" style={{ color: '#0f172a' }}>{f.title}</h4>
                                <p className="landing-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Problems ── */}
            <section className="landing-section" ref={problemRef} data-section="problem">
                <div className="landing-container">
                    <p className="landing-section-eyebrow">The Problem</p>
                    <h2 className={`landing-heading ${visible.problem ? 'landing-anim-in' : ''}`}>
                        Why businesses struggle with <span>traditional payroll</span>
                    </h2>
                    <div className="landing-problem-grid">
                        {PROBLEMS.map((item, i) => (
                            <div
                                key={item.title}
                                className={`landing-problem-card ${visible.problem ? 'landing-anim-in' : ''}`}
                                style={{ animationDelay: `${0.1 * i}s` }}
                            >
                                <div className="landing-problem-num">{i + 1}</div>
                                <div>
                                    <span className="landing-problem-icon">{item.title}</span>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── CTA ── */}
            <section className="landing-cta" ref={ctaRef} data-section="cta">
                <div className="landing-container" style={{ textAlign: 'center' }}>
                    <h2 className={`landing-cta-title ${visible.cta ? 'landing-anim-in' : ''}`}>
                        Ready to automate your workforce?
                    </h2>
                    <p className={`landing-cta-sub ${visible.cta ? 'landing-anim-in' : ''}`}>
                        Join businesses that trust Shiv Enterprises for payroll, attendance, and HR management.
                    </p>
                    <div className={`landing-cta-buttons ${visible.cta ? 'landing-anim-in' : ''}`}>
                        <button className="landing-btn landing-btn-primary" onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setAuthMode('register');
                        }}>
                            Start Now
                        </button>
                        <button className="landing-btn landing-btn-outline" onClick={() => navigate('/contact')}>
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
