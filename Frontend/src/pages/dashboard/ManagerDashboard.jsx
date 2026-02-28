import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    const { data: supData } = useFetch('/supervisors');
    const { data: empData } = useFetch('/employees');
    const { data: attData } = useFetch('/attendance', { month, year });
    const { data: leaveData } = useFetch('/leaves', { status: 'pending' });
    const { data: payData } = useFetch('/payroll/history', { month, year });

    const supervisors = supData?.supervisors || [];
    const employees = empData?.employees || [];
    const attendance = attData?.attendance || [];
    const pendingLeaves = leaveData?.leaves || [];
    const payrolls = payData?.payrolls || [];

    const presentToday = attendance.filter(a => a.status === 'present').length;
    const absentToday = attendance.filter(a => a.status === 'absent').length;
    const totalNetPay = payrolls.reduce((s, p) => s + (p.netPay || 0), 0);
    const activeEmp = employees.filter(e => e.status === 'active').length;

    const attChartData = [
        { name: 'Present', value: presentToday },
        { name: 'Absent', value: absentToday },
        { name: 'Half Day', value: attendance.filter(a => a.status === 'halfDay').length },
        { name: 'On Leave', value: attendance.filter(a => a.status === 'leave').length },
    ];

    const leaveCols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || '—' },
        { key: 'type', label: 'Type', render: r => <span style={{ textTransform: 'capitalize' }}>{r.type}</span> },
        { key: 'startDate', label: 'From', render: r => formatDate(r.startDate) },
        { key: 'days', label: 'Days', render: r => <strong>{r.days}</strong> },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
    ];

    const supCols = [
        { key: 'user', label: 'Supervisor', render: r => r.user?.name || '—' },
        { key: 'department', label: 'Department' },
        { key: 'employees', label: 'Employees', render: r => <strong>{r.employees?.length || 0}</strong> },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0114 0v2" /><path d="M19 10l2 2-2 2" /></svg>
                        Manager Dashboard
                    </h1>
                    <p className="page-subtitle">
                        {monthLabel} {user?.name ? ` · Welcome, ${user.name}` : ''}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/attendance')}>
                    Mark Attendance
                </button>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Active Employees" value={activeEmp} icon="🧑‍💼" color="cyan" />
                <StatCard label="Present Today" value={presentToday} icon="✅" color="green" />
                <StatCard label="Payroll This Month" value={formatCurrency(totalNetPay)} icon="💳" color="purple" />
                <StatCard label="Pending Leaves" value={pendingLeaves.length} icon="📋" color="yellow" />
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Supervisors" value={supervisors.length} icon="👥" color="blue" />
                <StatCard label="Total Employees" value={employees.length} icon="👤" color="blue" />
                <StatCard label="Absent Today" value={absentToday} icon="❌" color="red" />
                <StatCard label="On Leave" value={attendance.filter(a => a.status === 'leave').length} icon="🌴" color="orange" />
            </div>

            {/* Charts */}
            <div className="charts-grid" style={{ marginBottom: 24 }}>
                <ChartCard title="Today's Attendance" type="bar" data={attChartData} dataKeys={['value']} xKey="name" />
            </div>

            {/* Supervisors + Pending Leaves */}
            <div className="quick-grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3>My Supervisors</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate('/supervisors')}>Manage</button>
                    </div>
                    <DataTable columns={supCols} data={supervisors.slice(0, 6)} emptyText="No supervisors yet." />
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Pending Leave Requests</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate('/leaves/approval')}>Review All</button>
                    </div>
                    <DataTable columns={leaveCols} data={pendingLeaves.slice(0, 5)} emptyText="No pending leaves." />
                </div>
            </div>
        </div>
    );
}
