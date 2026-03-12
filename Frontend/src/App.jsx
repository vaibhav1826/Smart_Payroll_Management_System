import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './controllers/context/AuthContext';
import PublicLayout from './views/layouts/PublicLayout';
import DashboardLayout from './views/layouts/DashboardLayout';
import ErrorBoundary from './views/components/ErrorBoundary';
import LoadingSpinner from './views/components/LoadingSpinner';

// ── Public pages ──────────────────────────────────────────────────────────────
const Home = lazy(() => import('./views/pages/public/Home'));
const About = lazy(() => import('./views/pages/public/About'));
const Contact = lazy(() => import('./views/pages/public/Contact'));
const Register = lazy(() => import('./views/pages/public/Register'));
const Login = lazy(() => import('./views/pages/public/Login'));

// ── Role Dashboards ───────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./views/pages/dashboard/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./views/pages/dashboard/ManagerDashboard'));
const SupervisorDashboard = lazy(() => import('./views/pages/dashboard/SupervisorDashboard'));

// ── Organisation ──────────────────────────────────────────────────────────────
const EmployeeList = lazy(() => import('./views/pages/employee/EmployeeList'));
const DepartmentList = lazy(() => import('./views/pages/employee/DepartmentList'));

// ── Operations ────────────────────────────────────────────────────────────────
const AttendanceMark = lazy(() => import('./views/pages/attendance/AttendanceMark'));
const AttendanceBulk = lazy(() => import('./views/pages/attendance/AttendanceBulk'));
const ShiftManagement = lazy(() => import('./views/pages/attendance/ShiftManagement'));

// ── Finance ───────────────────────────────────────────────────────────────────
const PayrollGenerate = lazy(() => import('./views/pages/payroll/PayrollGenerate'));
const PayrollHistory = lazy(() => import('./views/pages/payroll/PayrollHistory'));
const SalarySlip = lazy(() => import('./views/pages/payroll/SalarySlip'));
const SalaryStructure = lazy(() => import('./views/pages/payroll/SalaryStructure'));

// ── Platform ──────────────────────────────────────────────────────────────────
const AuditLogs = lazy(() => import('./views/pages/audit/AuditLogs'));

// ── CSS ───────────────────────────────────────────────────────────────────────
import './styles/global.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/tables.css';
import './styles/dashboard.css';
import './styles/components.css';
import './styles/responsive.css';

// ── Role-based dashboard redirect ─────────────────────────────────────────────
import { useAuth } from './controllers/context/AuthContext';

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

import BackgroundManager from './views/components/BackgroundManager';

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
            <Route path="departments" element={<Page><AdminOrManager><DepartmentList /></AdminOrManager></Page>} />

            {/* Operations */}
            <Route path="attendance" element={<Page><AttendanceMark /></Page>} />
            <Route path="attendance/bulk" element={<Page><AttendanceBulk /></Page>} />
            <Route path="shifts" element={<Page><AdminOnly><ShiftManagement /></AdminOnly></Page>} />

            {/* Finance */}
            <Route path="payroll" element={<Page><AdminOnly><PayrollGenerate /></AdminOnly></Page>} />
            <Route path="payroll/history" element={<Page><AdminOrManager><PayrollHistory /></AdminOrManager></Page>} />
            <Route path="salary-slips" element={<Page><SalarySlip /></Page>} />
            <Route path="salary-structure" element={<Page><AdminOnly><SalaryStructure /></AdminOnly></Page>} />

            {/* Platform */}
            <Route path="audit-logs" element={<Page><AdminOnly><AuditLogs /></AdminOnly></Page>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
