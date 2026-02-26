import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const BREADCRUMB_MAP = {
    '/dashboard': 'Dashboard',
    '/industries': 'Industries',
    '/managers': 'Managers',
    '/contractors': 'Contractors',
    '/employees': 'Employees',
    '/supervisors': 'Supervisors',
    '/attendance': 'Attendance',
    '/attendance/bulk': 'Bulk Entry',
    '/shifts': 'Shifts',
    '/leaves': 'Leave Applications',
    '/leaves/approval': 'Leave Approvals',
    '/leaves/balance': 'Leave Balance',
    '/salary-structures': 'Salary Structures',
    '/payroll': 'Generate Payroll',
    '/payroll/history': 'Payroll History',
    '/salary-slips': 'Salary Slips',
    '/reports': 'Reports',
    '/audit-logs': 'Audit Logs',
    '/subscription': 'Subscription',
};

const ROLE_COLOURS = {
    admin: { bg: '#fef2f2', color: '#cc0000' },
    manager: { bg: '#eff6ff', color: '#1d4ed8' },
    supervisor: { bg: '#f0fdf4', color: '#16a34a' },
};

function BellIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    );
}

export default function Topbar({ sidebarOpen, onSidebarToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, updateProfile } = useAuth();
    const { notifications, unreadCount, markAllRead } = useNotifications();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const notifRef = useRef(null);
    const userRef = useRef(null);

    const currentPage = BREADCRUMB_MAP[location.pathname] || 'Dashboard';
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'U';
    const roleStyle = ROLE_COLOURS[user?.role] || {};

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-hamburger" onClick={onSidebarToggle} title="Toggle sidebar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div className="topbar-breadcrumb">
                    Shiv Enterprises &rsaquo; <span>{currentPage}</span>
                </div>
            </div>

            <div className="topbar-right">
                {/* Bell notification */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        className="topbar-icon-btn"
                        onClick={() => { setNotifOpen(v => !v); setUserOpen(false); }}
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <BellIcon />
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>

                    {notifOpen && (
                        <div className="notif-dropdown">
                            <div className="notif-header">
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <button className="btn btn-sm btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={markAllRead}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            {notifications.length === 0
                                ? <div className="notif-item text-muted text-sm">No notifications.</div>
                                : notifications.slice(0, 8).map((n, i) => (
                                    <div key={n._id || i} className={`notif-item${!n.read ? ' unread' : ''}`}>
                                        <div style={{ fontWeight: n.read ? 400 : 600, fontSize: 13 }}>{n.title || n.message}</div>
                                        {n.body && <div className="text-muted text-xs" style={{ marginTop: 2 }}>{n.body}</div>}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* User menu */}
                <div className="topbar-user" ref={userRef} onClick={() => { setUserOpen(v => !v); setNotifOpen(false); }}>
                    <div className="topbar-avatar">{initials}</div>

                    <div className="topbar-user-info">
                        <div className="topbar-user-name">{user?.name || 'User'}</div>
                        <div
                            className="topbar-user-role"
                            style={{
                                background: roleStyle.bg,
                                color: roleStyle.color,
                                padding: '1px 7px',
                                borderRadius: 20,
                                fontSize: 10,
                                fontWeight: 700,
                                display: 'inline-block',
                                textTransform: 'capitalize',
                            }}
                        >
                            {user?.role}
                        </div>
                    </div>

                    {userOpen && (
                        <div className="user-dropdown" onClick={e => e.stopPropagation()}>
                            <div className="user-dropdown-header">
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
                                <div className="text-muted text-sm">{user?.email}</div>
                            </div>
                            <button className="user-dropdown-item danger" onClick={handleLogout}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
