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
const Login = lazy(() => import('./pages/public/Login'));

// ── Role Dashboards ───────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./pages/dashboard/ManagerDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/dashboard/SupervisorDashboard'));

// ── Organisation ──────────────────────────────────────────────────────────────
const IndustryList = lazy(() => import('./pages/industry/IndustryList'));
const ManagerList = lazy(() => import('./pages/manager/ManagerList'));
const SupervisorList = lazy(() => import('./pages/supervisor/SupervisorList'));
const EmployeeList = lazy(() => import('./pages/employee/EmployeeList'));
const ContractorList = lazy(() => import('./pages/contractor/ContractorList'));

// ── Operations ────────────────────────────────────────────────────────────────
const AttendanceMark = lazy(() => import('./pages/attendance/AttendanceMark'));
const AttendanceBulk = lazy(() => import('./pages/attendance/AttendanceBulk'));
const ShiftManagement = lazy(() => import('./pages/attendance/ShiftManagement'));
const LeaveApply = lazy(() => import('./pages/leave/LeaveApply'));
const LeaveApproval = lazy(() => import('./pages/leave/LeaveApproval'));
const LeaveBalance = lazy(() => import('./pages/leave/LeaveBalance'));

// ── Finance ───────────────────────────────────────────────────────────────────
const SalaryStructure = lazy(() => import('./pages/payroll/SalaryStructure'));
const PayrollGenerate = lazy(() => import('./pages/payroll/PayrollGenerate'));
const PayrollHistory = lazy(() => import('./pages/payroll/PayrollHistory'));
const SalarySlip = lazy(() => import('./pages/payroll/SalarySlip'));

// ── Platform ──────────────────────────────────────────────────────────────────
const Reports = lazy(() => import('./pages/reports/Reports'));
const AuditLogs = lazy(() => import('./pages/audit/AuditLogs'));
const SubscriptionPage = lazy(() => import('./pages/admin/SubscriptionPage'));

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

export default function App() {
  return (
    <BrowserRouter>
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
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Page><RoleDashboard /></Page>} />

            {/* Organisation — admin + manager */}
            <Route path="industries" element={<Page><AdminOnly><IndustryList /></AdminOnly></Page>} />
            <Route path="managers" element={<Page><AdminOnly><ManagerList /></AdminOnly></Page>} />
            <Route path="contractors" element={<Page><AdminOnly><ContractorList /></AdminOnly></Page>} />
            <Route path="supervisors" element={<Page><AdminOrManager><SupervisorList /></AdminOrManager></Page>} />
            <Route path="employees" element={<Page><AdminOrManager><EmployeeList /></AdminOrManager></Page>} />

            {/* Operations */}
            <Route path="attendance" element={<Page><AttendanceMark /></Page>} />
            <Route path="attendance/bulk" element={<Page><AttendanceBulk /></Page>} />
            <Route path="shifts" element={<Page><AdminOnly><ShiftManagement /></AdminOnly></Page>} />
            <Route path="leaves" element={<Page><LeaveApply /></Page>} />
            <Route path="leaves/approval" element={<Page><LeaveApproval /></Page>} />
            <Route path="leaves/balance" element={<Page><LeaveBalance /></Page>} />

            {/* Finance */}
            <Route path="salary-structures" element={<Page><AdminOnly><SalaryStructure /></AdminOnly></Page>} />
            <Route path="payroll" element={<Page><AdminOnly><PayrollGenerate /></AdminOnly></Page>} />
            <Route path="payroll/history" element={<Page><PayrollHistory /></Page>} />
            <Route path="salary-slips" element={<Page><SalarySlip /></Page>} />

            {/* Platform */}
            <Route path="reports" element={<Page><Reports /></Page>} />
            <Route path="audit-logs" element={<Page><AdminOnly><AuditLogs /></AdminOnly></Page>} />
            <Route path="subscription" element={<Page><AdminOnly><SubscriptionPage /></AdminOnly></Page>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
