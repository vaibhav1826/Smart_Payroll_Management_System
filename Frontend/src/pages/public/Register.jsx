import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'employee' });
    const [loading, setLoading] = useState(false);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
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
            {/* Left panel — branding */}
            <div className="auth-split-left">
                <div className="auth-brand-panel">
                    <Logo width={60} height={60} />
                    <h1 className="auth-brand-title">Shiv Enterprises</h1>
                    <p className="auth-brand-tagline">Smart Payroll &amp; Workforce Management Platform</p>
                    <div className="auth-brand-features">
                        <div className="auth-feature-item">Contractor and employee management</div>
                        <div className="auth-feature-item">Attendance and shift tracking</div>
                        <div className="auth-feature-item">Leave application and approvals</div>
                        <div className="auth-feature-item">Automated payroll calculations</div>
                        <div className="auth-feature-item">Detailed reports and audit logs</div>
                    </div>
                </div>
            </div>

            {/* Right panel — registration form */}
            <div className="auth-split-right">
                <div className="auth-form-wrap">
                    <div className="auth-form-header">
                        <h2 className="auth-form-title">Create Account</h2>
                        <p className="auth-form-subtitle">Join the Shiv Enterprises payroll platform</p>
                    </div>

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-field">
                            <label className="form-label" htmlFor="reg-name">Full Name</label>
                            <input id="reg-name" name="name" className="form-input" placeholder="Your full name" value={form.name} onChange={onChange} required />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="reg-email">Email Address</label>
                            <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@company.com" value={form.email} onChange={onChange} required />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                            <input id="reg-phone" name="phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={onChange} />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="reg-role">Role</label>
                            <select id="reg-role" name="role" className="form-input" value={form.role} onChange={onChange}>
                                <option value="employee">Employee</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="contractor">Contractor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="reg-password">Password</label>
                            <input id="reg-password" name="password" type="password" className="form-input" placeholder="Minimum 6 characters" value={form.password} onChange={onChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-form-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
