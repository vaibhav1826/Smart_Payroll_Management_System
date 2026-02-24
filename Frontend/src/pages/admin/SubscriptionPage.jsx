import React, { useState } from 'react';

const PLANS = [
    {
        name: 'Starter',
        price: '₹1,999',
        period: '/month',
        features: ['Up to 50 Employees', '1 Industry', '2 Managers', 'Attendance & Payroll', 'PDF Salary Slips', 'Email Support'],
        color: 'var(--info)',
        bg: 'var(--info-light)',
    },
    {
        name: 'Professional',
        price: '₹4,999',
        period: '/month',
        features: ['Up to 250 Employees', '5 Industries', '10 Managers', 'Full PF/ESIC/TDS', 'Excel Reports', 'Priority Support', 'Audit Logs'],
        color: 'var(--red)',
        bg: 'var(--red-light)',
        recommended: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: ['Unlimited Employees', 'Unlimited Industries', 'Unlimited Managers', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'API Access'],
        color: 'var(--purple)',
        bg: 'var(--purple-light)',
    },
];

export default function SubscriptionPage() {
    const [current] = useState('Professional'); // In real app, fetched from API
    const [demoToggle, setDemoToggle] = useState(true);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        Subscription
                    </h1>
                    <p className="page-subtitle">Manage contractor access, plan, and demo controls</p>
                </div>
            </div>

            {/* Current Plan Banner */}
            <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--red)', background: 'var(--red-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current Active Plan</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{current} Plan</div>
                        <div className="text-muted text-sm" style={{ marginTop: 4 }}>Renews on 31 March 2026 · All features active</div>
                    </div>
                    <span className="badge badge-red" style={{ fontSize: 13, padding: '6px 16px' }}>Active</span>
                </div>
            </div>

            {/* Demo Access Toggle */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Demo Access Control</div>
                        <p className="text-muted text-sm">
                            When enabled, invited contractors can explore the system with sample data before subscribing.
                            Admin controls all demo invitations manually — no public registration.
                        </p>
                    </div>
                    <button
                        onClick={() => setDemoToggle(v => !v)}
                        style={{
                            width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                            background: demoToggle ? 'var(--success)' : 'var(--border)',
                            position: 'relative', transition: 'background 0.3s', flexShrink: 0,
                        }}
                    >
                        <span style={{
                            position: 'absolute', top: 3, left: demoToggle ? 26 : 3,
                            width: 22, height: 22, borderRadius: '50%', background: '#fff',
                            transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }} />
                    </button>
                </div>
                {demoToggle && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--success-light)', borderRadius: 8, border: '1px solid var(--success-border)' }}>
                        <span className="text-success" style={{ fontWeight: 600, fontSize: 13 }}>✓ Demo access is currently enabled.</span>
                        <span className="text-muted text-sm"> Invited contractors can log in with demo credentials.</span>
                    </div>
                )}
            </div>

            {/* Plan Cards */}
            <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Available Plans</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
                {PLANS.map(plan => (
                    <div key={plan.name} className="card" style={{
                        borderTop: `4px solid ${plan.color}`,
                        position: 'relative',
                        boxShadow: plan.recommended ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                        transform: plan.recommended ? 'translateY(-4px)' : 'none',
                    }}>
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute', top: -1, right: 16,
                                background: plan.color, color: '#fff',
                                fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: '0 0 8px 8px',
                                letterSpacing: '0.06em',
                            }}>CURRENT</div>
                        )}
                        <div style={{ marginBottom: 4, color: plan.color, fontWeight: 700, fontSize: 14 }}>{plan.name}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {plan.price}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>{plan.period}</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginTop: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {plan.features.map(f => (
                                <li key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                                    <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="btn btn-full"
                            style={{ background: plan.name === current ? 'var(--bg-subtle)' : plan.color, color: plan.name === current ? 'var(--text-muted)' : '#fff', border: 'none' }}
                            disabled={plan.name === current}
                        >
                            {plan.name === current ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Note */}
            <div className="card" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                <p className="text-muted text-sm" style={{ lineHeight: 1.8 }}>
                    <strong>Note:</strong> All logins are admin-controlled. No public sign-up exists.
                    Contact <a href="mailto:admin@shiventerprises.in">admin@shiventerprises.in</a> to provision new contractor access or upgrade your plan.
                    Demo accounts can be created manually from the Admin panel.
                </p>
            </div>
        </div>
    );
}
