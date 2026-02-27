import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// ── Public pages ──────────────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Register = lazy(() => import('./pages/public/Register'));
const Login = lazy(() => import('./pages/public/Login'));

// ── Role Dashboards ───────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./pages/dashboard/ManagerDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/dashboard/SupervisorDashboard'));

// ── Organisation ──────────────────────────────────────────────────────────────
const EmployeeList = lazy(() => import('./pages/employee/EmployeeList'));

// ── Operations ────────────────────────────────────────────────────────────────
const AttendanceMark = lazy(() => import('./pages/attendance/AttendanceMark'));
const AttendanceBulk = lazy(() => import('./pages/attendance/AttendanceBulk'));
const ShiftManagement = lazy(() => import('./pages/attendance/ShiftManagement'));

// ── Finance ───────────────────────────────────────────────────────────────────
const PayrollGenerate = lazy(() => import('./pages/payroll/PayrollGenerate'));

// ── Platform ──────────────────────────────────────────────────────────────────
const AuditLogs = lazy(() => import('./pages/audit/AuditLogs'));

// ── CSS ───────────────────────────────────────────────────────────────────────
import './styles/global.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/tables.css';
import './styles/dashboard.css';
import './styles/components.css';
import './styles/responsive.css';

// ── Role-based dashboard redirect ─────────────────────────────────────────────
import { useAuth } from './context/AuthContext';

function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'manager') return <ManagerDashboard />;
  if (user.role === 'supervisor') return <SupervisorDashboard />;
  // Employees have NO dashboard — redirect to login
  return <Navigate to="/login" replace />;
}

// ── Admin-only guard ──────────────────────────────────────────────────────────
function AdminOnly({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// ── Admin + Manager guard ─────────────────────────────────────────────────────
function AdminOrManager({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!['admin', 'manager'].includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Page({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullscreen />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

import BackgroundManager from './components/BackgroundManager';

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundManager />
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { style: { background: '#14532d', color: '#f0fdf4', border: '1px solid #16a34a' } },
            error: { style: { background: '#7f1d1d', color: '#fef2f2', border: '1px solid #dc2626' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Page><Home /></Page>} />
            <Route path="about" element={<Page><About /></Page>} />
            <Route path="contact" element={<Page><Contact /></Page>} />
            <Route path="login" element={<Page><Login /></Page>} />
            <Route path="register" element={<Page><Register /></Page>} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Page><RoleDashboard /></Page>} />

            {/* Organisation — admin + manager */}
            <Route path="employees" element={<Page><AdminOrManager><EmployeeList /></AdminOrManager></Page>} />

            {/* Operations */}
            <Route path="attendance" element={<Page><AttendanceMark /></Page>} />
            <Route path="attendance/bulk" element={<Page><AttendanceBulk /></Page>} />
            <Route path="shifts" element={<Page><AdminOnly><ShiftManagement /></AdminOnly></Page>} />

            {/* Finance */}
            <Route path="payroll" element={<Page><AdminOnly><PayrollGenerate /></AdminOnly></Page>} />

            {/* Platform */}
            <Route path="audit-logs" element={<Page><AdminOnly><AuditLogs /></AdminOnly></Page>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
