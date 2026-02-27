import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Email and password are required.');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Login failed. Please check your credentials.');
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
                        <p className="auth-brand-tagline">Smart Payroll &amp; Workforce Management</p>
                        <div className="auth-brand-features">
                            <div className="auth-feature-item">Automated payroll generation</div>
                            <div className="auth-feature-item">Real-time attendance tracking</div>
                            <div className="auth-feature-item">Leave management workflow</div>
                            <div className="auth-feature-item">Salary slip PDF generation</div>
                            <div className="auth-feature-item">Role-based access control</div>
                        </div>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="auth-split-right">
                    <div className="auth-form-wrap">
                        <div className="auth-form-header">
                            <h2 className="auth-form-title">Sign In</h2>
                            <p className="auth-form-subtitle">Enter your credentials to access the dashboard</p>
                        </div>

                        <form onSubmit={onSubmit} className="auth-form">
                            <div className="form-field">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <input
                                    id="email" name="email" type="email"
                                    className="form-input"
                                    placeholder="you@company.com"
                                    value={form.email} onChange={onChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    id="password" name="password" type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={form.password} onChange={onChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="auth-form-footer">
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
