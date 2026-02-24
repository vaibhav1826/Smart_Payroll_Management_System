import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';

// Layouts (loaded eagerly — tiny, always needed)
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Error boundary
import ErrorBoundary from './components/ErrorBoundary';

// Full-screen loading fallback
import LoadingSpinner from './components/LoadingSpinner';

// ── Lazy-loaded public pages ──────────────────────────────────────────────────
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));

// ── Lazy-loaded dashboard pages ───────────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/dashboard/SupervisorDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/dashboard/EmployeeDashboard'));

// Core CRUD
const IndustryList = lazy(() => import('./pages/industry/IndustryList'));
const ContractorList = lazy(() => import('./pages/contractor/ContractorList'));
const EmployeeList = lazy(() => import('./pages/employee/EmployeeList'));
const SupervisorList = lazy(() => import('./pages/supervisor/SupervisorList'));

// Operations
const AttendanceMark = lazy(() => import('./pages/attendance/AttendanceMark'));
const AttendanceBulk = lazy(() => import('./pages/attendance/AttendanceBulk'));
const ShiftManagement = lazy(() => import('./pages/attendance/ShiftManagement'));
const LeaveApply = lazy(() => import('./pages/leave/LeaveApply'));
const LeaveApproval = lazy(() => import('./pages/leave/LeaveApproval'));
const LeaveBalance = lazy(() => import('./pages/leave/LeaveBalance'));

// Finance
const SalaryStructure = lazy(() => import('./pages/payroll/SalaryStructure'));
const PayrollGenerate = lazy(() => import('./pages/payroll/PayrollGenerate'));
const PayrollHistory = lazy(() => import('./pages/payroll/PayrollHistory'));
const SalarySlip = lazy(() => import('./pages/payroll/SalarySlip'));

// Platform
const Reports = lazy(() => import('./pages/reports/Reports'));
const AuditLogs = lazy(() => import('./pages/audit/AuditLogs'));

// CSS
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
  if (user.role === 'supervisor') return <SupervisorDashboard />;
  return <EmployeeDashboard />;
}

// ── Page wrapper with Suspense + ErrorBoundary ────────────────────────────────
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
          toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }}
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
            <Route path="industries" element={<Page><IndustryList /></Page>} />
            <Route path="contractors" element={<Page><ContractorList /></Page>} />
            <Route path="employees" element={<Page><EmployeeList /></Page>} />
            <Route path="supervisors" element={<Page><SupervisorList /></Page>} />
            <Route path="attendance" element={<Page><AttendanceMark /></Page>} />
            <Route path="attendance/bulk" element={<Page><AttendanceBulk /></Page>} />
            <Route path="shifts" element={<Page><ShiftManagement /></Page>} />
            <Route path="leaves" element={<Page><LeaveApply /></Page>} />
            <Route path="leaves/approval" element={<Page><LeaveApproval /></Page>} />
            <Route path="leaves/balance" element={<Page><LeaveBalance /></Page>} />
            <Route path="salary-structures" element={<Page><SalaryStructure /></Page>} />
            <Route path="payroll" element={<Page><PayrollGenerate /></Page>} />
            <Route path="payroll/history" element={<Page><PayrollHistory /></Page>} />
            <Route path="salary-slips" element={<Page><SalarySlip /></Page>} />
            <Route path="reports" element={<Page><Reports /></Page>} />
            <Route path="audit-logs" element={<Page><AuditLogs /></Page>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
