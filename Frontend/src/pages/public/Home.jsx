import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WORKFLOW_STEPS = [
    'Contractor sets up company',
    'Supervisors assigned',
    'Employees onboarded',
    'Attendance marked daily',
    'Payroll auto-calculated',
    'Salary slips generated',
];

const PROBLEMS = [
    { title: 'Manual Salary Calculations', desc: 'Time-consuming, error-prone calculations that cause disputes.' },
    { title: 'Attendance Discrepancies', desc: 'Manual logs lead to inaccurate pay and employee grievances.' },
    { title: 'Excel-Based Payroll Risks', desc: 'Formulas break, files get corrupted, no audit trail.' },
    { title: 'Compliance & Audit Gaps', desc: 'Paper-based records are hard to audit, retrieve, or scale.' },
];

export default function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ employees: 0, accuracy: 0, companies: 0 });
    const [visible, setVisible] = useState({ problem: false, workflow: false, cta: false });

    const problemRef = useRef(null);
    const workflowRef = useRef(null);
    const ctaRef = useRef(null);

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
        [problemRef, workflowRef, ctaRef].forEach(r => { if (r.current) observer.observe(r.current); });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing">

            {/* ── Hero ── */}
            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-hero-badge">Payroll &amp; Workforce Management</div>
                    <h1 className="landing-hero-title landing-anim-fade-up">
                        Smarter Payroll.<br />
                        <span>Stronger Workforce.</span>
                    </h1>
                    <p className="landing-hero-sub landing-anim-fade-up landing-anim-delay-1">
                        Automate attendance, leaves, and salary — all in one secure platform built for Indian businesses.
                    </p>
                    <div className="landing-hero-buttons landing-anim-fade-up landing-anim-delay-2">
                        <button className="landing-btn landing-btn-primary" onClick={() => navigate('/login')}>
                            Get Started
                        </button>
                        <button className="landing-btn landing-btn-outline" onClick={() => navigate('/about')}>
                            Learn More
                        </button>
                    </div>

                    <div className="landing-hero-stats landing-anim-fade-up landing-anim-delay-3">
                        <div className="landing-stat">
                            <span className="landing-stat-value">{stats.employees.toLocaleString()}+</span>
                            <span className="landing-stat-label">Employees Managed</span>
                        </div>
                        <div className="landing-stat-sep" />
                        <div className="landing-stat">
                            <span className="landing-stat-value">{stats.accuracy}%</span>
                            <span className="landing-stat-label">Payroll Accuracy</span>
                        </div>
                        <div className="landing-stat-sep" />
                        <div className="landing-stat">
                            <span className="landing-stat-value">{stats.companies}+</span>
                            <span className="landing-stat-label">Companies Served</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Problems ── */}
            <section className="landing-section landing-section-alt" ref={problemRef} data-section="problem">
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

            {/* ── How It Works ── */}
            <section className="landing-section" ref={workflowRef} data-section="workflow">
                <div className="landing-container">
                    <p className="landing-section-eyebrow">How It Works</p>
                    <h2 className={`landing-heading ${visible.workflow ? 'landing-anim-in' : ''}`}>
                        Six steps to <span>full automation</span>
                    </h2>
                    <div className="landing-workflow">
                        {WORKFLOW_STEPS.map((label, i) => (
                            <React.Fragment key={label}>
                                <div
                                    className={`landing-workflow-step ${visible.workflow ? 'landing-anim-in' : ''}`}
                                    style={{ animationDelay: `${0.1 * i}s` }}
                                >
                                    <span className="landing-workflow-num">{i + 1}</span>
                                    <span>{label}</span>
                                </div>
                                {i < WORKFLOW_STEPS.length - 1 && <span className="landing-workflow-line" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-section landing-section-alt">
                <div className="landing-container">
                    <p className="landing-section-eyebrow">Platform Features</p>
                    <h2 className="landing-heading">Everything you need, <span>in one place</span></h2>
                    <div className="landing-features-grid">
                        {[
                            { title: 'Attendance Management', desc: 'Daily & bulk attendance with shift tracking.' },
                            { title: 'Leave Workflow', desc: 'Apply, approve, and track all leave types.' },
                            { title: 'Payroll Generation', desc: 'Auto-calculate salaries from attendance data.' },
                            { title: 'Salary Structures', desc: 'Configure Basic, HRA, DA, PF percentages.' },
                            { title: 'Salary Slip PDF', desc: 'Download professional payslips instantly.' },
                            { title: 'Reports & Audit Logs', desc: 'Full transparency with CSV and Excel export.' },
                        ].map(f => (
                            <div key={f.title} className="landing-feature-card">
                                <div className="landing-feature-indicator" />
                                <h4 className="landing-feature-title">{f.title}</h4>
                                <p className="landing-feature-desc">{f.desc}</p>
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
                        <button className="landing-btn landing-btn-primary" onClick={() => navigate('/login')}>
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
