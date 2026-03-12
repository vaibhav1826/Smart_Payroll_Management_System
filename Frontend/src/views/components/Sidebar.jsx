import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/context/AuthContext';
import Logo from './Logo';

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
const Icon = {
    dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
    industry: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M3 7l6-4v4M9 3v18M9 7l6-4v4M15 3v18M15 7l6-4v4M21 7v14" /></svg>,
    manager: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0114 0v2" /><path d="M19 10l2 2-2 2" /></svg>,
    supervisor: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0114 0v2" /><circle cx="19" cy="11" r="3" /><path d="M22 21v-1a3 3 0 00-6 0v1" /></svg>,
    employee: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="5" /><path d="M3 21v-2a9 9 0 0118 0v2" /></svg>,
    contractor: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 00-8 0v2" /><line x1="12" y1="12" x2="12" y2="16" /></svg>,
    attendance: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><polyline points="9 11 12 14 15 11" /></svg>,
    bulk: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
    shift: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" /></svg>,
    leave: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>,
    approval: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    balance: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7H15a3.5 3.5 0 010 7H6" /></svg>,
    salary: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
    payroll: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    history: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>,
    slip: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
    reports: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    audit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    subscription: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
};

/* ── Nav configs ─────────────────────────────────────────────────────────────── */
const ADMIN_SECTIONS = [
    {
        label: 'Overview',
        links: [
            { to: '/dashboard', label: 'Dashboard', icon: Icon.dashboard, end: true },
        ],
    },
    {
        label: 'Core Management',
        links: [
            { to: '/employees', label: 'Employee Core', icon: Icon.employee },
            { to: '/departments', label: 'Departments', icon: Icon.industry },
        ],
    },
    {
        label: 'Operations',
        links: [
            { to: '/attendance', label: 'Attendance', icon: Icon.attendance },
            { to: '/attendance/bulk', label: 'Bulk Entry', icon: Icon.bulk },
            { to: '/shifts', label: 'Shifts', icon: Icon.shift },
        ],
    },
    {
        label: 'Finance',
        links: [
            { to: '/payroll', label: 'Salary Management', icon: Icon.payroll },
        ],
    },
    // {
    //     label: 'Platform',
    //     links: [
    //         { to: '/audit-logs', label: 'Audit Logs', icon: Icon.audit },
    //     ],
    // },
];

const MANAGER_SECTIONS = [
    {
        label: 'Overview',
        links: [
            { to: '/dashboard', label: 'Dashboard', icon: Icon.dashboard, end: true },
        ],
    },
    {
        label: 'Core Management',
        links: [
            { to: '/employees', label: 'Employee Core', icon: Icon.employee },
            { to: '/departments', label: 'Departments', icon: Icon.industry },
        ],
    },
    {
        label: 'Operations',
        links: [
            { to: '/attendance', label: 'Attendance', icon: Icon.attendance },
        ],
    },
];

const SUPERVISOR_SECTIONS = [
    {
        label: 'Overview',
        links: [
            { to: '/dashboard', label: 'Dashboard', icon: Icon.dashboard, end: true },
        ],
    },
    {
        label: 'Operations',
        links: [
            { to: '/attendance', label: 'Attendance', icon: Icon.attendance },
        ],
    },
];

/* role badge colours */
const ROLE_BADGE = {
    admin: { bg: '#fef2f2', color: '#cc0000', label: 'Admin' },
    manager: { bg: '#eff6ff', color: '#1d4ed8', label: 'Manager' },
    supervisor: { bg: '#f0fdf4', color: '#16a34a', label: 'Supervisor' },
};

function getSections(role) {
    if (role === 'admin') return ADMIN_SECTIONS;
    if (role === 'manager') return MANAGER_SECTIONS;
    return SUPERVISOR_SECTIONS;
}

export default function Sidebar({ open, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const sections = getSections(user?.role);
    const badge = ROLE_BADGE[user?.role] || {};

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <Logo width={32} height={32} />
                {open && (
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name">Shiv Enterprises</span>
                        {user?.role && (
                            <span className="sidebar-role-badge" style={{ background: badge.bg, color: badge.color }}>
                                {badge.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section.label} className="sidebar-section">
                        {open && <div className="sidebar-section-label">{section.label}</div>}
                        {section.links.map(({ to, label, icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={!!end}
                                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                                title={!open ? label : undefined}
                                onClick={() => {
                                    if (window.innerWidth <= 768) {
                                        onToggle();
                                    }
                                }}
                            >
                                <span className="sidebar-icon">{icon}</span>
                                {open && <span className="sidebar-label">{label}</span>}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout} title="Sign Out">
                    <span className="sidebar-icon">{Icon.logout}</span>
                    {open && <span className="sidebar-label">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
