import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
    const { user, loading, lastActivity } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            if (sidebarOpen) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, [sidebarOpen]);

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
