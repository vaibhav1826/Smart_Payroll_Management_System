import React, { useState, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
    const { user, loading, lastActivity } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const showInactivityWarning = lastActivity && (Date.now() - lastActivity > 28 * 60 * 1000);

    if (loading) {
        return (
            <div className="spinner-fullscreen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return (
        <NotificationProvider>
            <div className={`dashboard-shell${!sidebarOpen ? '' : ' sidebar-open'}`}>
                <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />

                <div className="dashboard-main">
                    <Topbar
                        sidebarOpen={sidebarOpen}
                        onSidebarToggle={() => setSidebarOpen(v => !v)}
                    />
                    <div className="dashboard-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </NotificationProvider>
    );
}
