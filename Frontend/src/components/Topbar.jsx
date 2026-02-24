import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

function buildBreadcrumb(pathname) {
    const map = {
        '/dashboard': 'Dashboard',
        '/industries': 'Industries',
        '/contractors': 'Contractors',
        '/employees': 'Employees',
        '/supervisors': 'Supervisors',
        '/attendance': 'Attendance',
        '/attendance/bulk': 'Bulk Entry',
        '/shifts': 'Shifts',
        '/leaves': 'Leaves',
        '/leaves/approval': 'Leave Approvals',
        '/leaves/balance': 'Leave Balance',
        '/salary-structures': 'Salary Structures',
        '/payroll': 'Generate Payroll',
        '/payroll/history': 'Payroll History',
        '/salary-slips': 'Salary Slips',
        '/reports': 'Reports',
        '/audit-logs': 'Audit Logs',
    };
    return map[pathname] || 'Dashboard';
}

export default function Topbar({ sidebarOpen, onSidebarToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllRead } = useNotifications();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const notifRef = useRef(null);
    const userRef = useRef(null);

    const currentPage = buildBreadcrumb(location.pathname);
    const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U';

    // Close dropdowns on outside click
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
                    {sidebarOpen ? '☰' : '☰'}
                </button>
                <div className="topbar-breadcrumb">
                    Shiv Enterprises &rsaquo; <span>{currentPage}</span>
                </div>
            </div>

            <div className="topbar-right">
                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        className="topbar-icon-btn"
                        onClick={() => { setNotifOpen(v => !v); setUserOpen(false); }}
                        title="Notifications"
                    >
                        Notifications
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>

                    {notifOpen && (
                        <div className="notif-dropdown">
                            <div className="notif-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        style={{ fontSize: 11, padding: '3px 8px' }}
                                        onClick={markAllRead}
                                    >
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
                    <div>
                        <div className="topbar-user-name">{user?.name}</div>
                        <div className="topbar-user-role">{user?.role}</div>
                    </div>

                    {userOpen && (
                        <div className="user-dropdown">
                            <div className="user-dropdown-header">
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
                                <div className="text-muted text-sm">{user?.email}</div>
                            </div>
                            <button className="user-dropdown-item danger" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
