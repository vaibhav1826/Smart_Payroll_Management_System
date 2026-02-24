import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const ADMIN_SECTIONS = [
    {
        label: 'Overview',
        links: [
            { to: '/dashboard', label: 'Dashboard' },
        ],
    },
    {
        label: 'Organisation',
        links: [
            { to: '/industries', label: 'Industries' },
            { to: '/contractors', label: 'Contractors' },
            { to: '/employees', label: 'Employees' },
            { to: '/supervisors', label: 'Supervisors' },
        ],
    },
    {
        label: 'Operations',
        links: [
            { to: '/attendance', label: 'Attendance' },
            { to: '/attendance/bulk', label: 'Bulk Entry' },
            { to: '/shifts', label: 'Shifts' },
            { to: '/leaves', label: 'Leave Applications' },
            { to: '/leaves/approval', label: 'Leave Approvals' },
            { to: '/leaves/balance', label: 'Leave Balance' },
        ],
    },
    {
        label: 'Finance',
        links: [
            { to: '/salary-structures', label: 'Salary Structures' },
            { to: '/payroll', label: 'Generate Payroll' },
            { to: '/payroll/history', label: 'Payroll History' },
            { to: '/salary-slips', label: 'Salary Slips' },
        ],
    },
    {
        label: 'Platform',
        links: [
            { to: '/reports', label: 'Reports' },
            { to: '/audit-logs', label: 'Audit Logs' },
        ],
    },
];

const SUPERVISOR_SECTIONS = [
    {
        label: 'Overview',
        links: [{ to: '/dashboard', label: 'Dashboard' }],
    },
    {
        label: 'Operations',
        links: [
            { to: '/attendance', label: 'Attendance' },
            { to: '/leaves', label: 'Leave Applications' },
            { to: '/leaves/approval', label: 'Leave Approvals' },
            { to: '/leaves/balance', label: 'Leave Balance' },
        ],
    },
];

const EMPLOYEE_SECTIONS = [
    {
        label: 'Overview',
        links: [{ to: '/dashboard', label: 'Dashboard' }],
    },
    {
        label: 'Self-Service',
        links: [
            { to: '/attendance', label: 'My Attendance' },
            { to: '/leaves', label: 'My Leaves' },
            { to: '/salary-slips', label: 'Salary Slips' },
        ],
    },
];

function getSections(role) {
    if (role === 'admin') return ADMIN_SECTIONS;
    if (role === 'supervisor') return SUPERVISOR_SECTIONS;
    return EMPLOYEE_SECTIONS;
}

export default function Sidebar({ open, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const sections = getSections(user?.role);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <Logo width={34} height={34} />
                <span className="sidebar-brand-name">Shiv Enterprises</span>
            </div>

            {/* Toggle button */}
            <button className="sidebar-toggle" onClick={onToggle} title={open ? 'Collapse' : 'Expand'}>
                {open ? '«' : '»'}
            </button>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section.label}>
                        <div className="sidebar-section-label">{section.label}</div>
                        {section.links.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/dashboard'}
                                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                            >
                                <span className="sidebar-label">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>
                    <span className="sidebar-label">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
