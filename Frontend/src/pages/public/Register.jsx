import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'employee', secretKey: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.secretKey) return toast.error('Secret Key is required for registration.');
        if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required.');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
        setLoading(true);
        try {
            const user = await register(form);
            toast.success(`Account created! Welcome, ${user.name}.`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left panel — branding */}
                <div className="auth-split-left">
                    <div className="auth-brand-panel">
                        <Logo width={64} height={64} />
                        <h1 className="auth-brand-title">Shiv Enterprises</h1>
                        <p className="auth-brand-tagline">Smart Payroll &amp; Workforce Management Platform</p>
                        <div className="auth-brand-features">
                            <div className="auth-feature-item">Comprehensive employee management</div>
                            <div className="auth-feature-item">Attendance and shift tracking</div>
                            <div className="auth-feature-item">Leave application and approvals</div>
                            <div className="auth-feature-item">Automated payroll calculations</div>
                            <div className="auth-feature-item">Detailed reports and audit logs</div>
                        </div>
                    </div>
                </div>

                {/* Right panel — registration form */}
                <div className="auth-split-right">
                    <div className="auth-form-wrap auth-form-wrap--register">
                        <div className="auth-form-header">
                            <h2 className="auth-form-title">Create Account</h2>
                            <p className="auth-form-subtitle">Join the Shiv Enterprises platform — fill in your details below</p>
                        </div>

                        <form onSubmit={onSubmit} className="auth-form auth-form--register">

                            {/* Secret Key — full width, prominent */}
                            <div className="register-secret-box">
                                <label className="form-label" htmlFor="reg-secret">
                                    Secret Key <span className="register-required-badge">Required</span>
                                </label>
                                <input
                                    id="reg-secret" name="secretKey"
                                    className="form-input"
                                    placeholder="Authorization key provided by your admin"
                                    value={form.secretKey}
                                    onChange={onChange}
                                    autoComplete="off"
                                    required
                                />
                                <p className="register-field-hint">Contact your administrator to get the registration key.</p>
                            </div>

                            {/* Two-column grid for main fields */}
                            <div className="register-grid">
                                <div className="form-field">
                                    <label className="form-label" htmlFor="reg-name">Full Name</label>
                                    <input
                                        id="reg-name" name="name"
                                        className="form-input"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={onChange}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                                    <input
                                        id="reg-phone" name="phone"
                                        className="form-input"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={form.phone}
                                        onChange={onChange}
                                        autoComplete="tel"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="reg-email">Email Address</label>
                                    <input
                                        id="reg-email" name="email" type="email"
                                        className="form-input"
                                        placeholder="you@company.com"
                                        value={form.email}
                                        onChange={onChange}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                <div className="form-field" style={{ position: 'relative' }}>
                                    <label className="form-label" htmlFor="reg-password">Password</label>
                                    <input
                                        id="reg-password" name="password"
                                        type={showPass ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Minimum 6 characters"
                                        value={form.password}
                                        onChange={onChange}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="register-show-pass"
                                        tabIndex={-1}
                                        title={showPass ? 'Hide password' : 'Show password'}
                                        style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}
                                    >
                                        {showPass ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                                style={{ marginTop: 8, height: '48px', fontSize: '15px', fontWeight: 700 }}
                            >
                                {loading ? 'Creating Account…' : 'Create Account →'}
                            </button>
                        </form>

                        <p className="auth-form-footer">
                            Already have an account? <Link to="/login">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
