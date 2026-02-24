import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export default function SupervisorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const now = new Date();

    const { data: empData } = useFetch('/employees');
    const { data: attData } = useFetch('/attendance', { month: now.getMonth() + 1, year: now.getFullYear() });
    const { data: leaveData } = useFetch('/leaves', { status: 'pending' });

    const employees = empData?.employees || [];
    const attendance = attData?.attendance || [];
    const pendingLeaves = leaveData?.leaves || [];

    const presentToday = attendance.filter(a => a.status === 'present').length;
    const absentToday = attendance.filter(a => a.status === 'absent').length;
    const halfDayToday = attendance.filter(a => a.status === 'halfDay').length;

    const attChartData = [
        { name: 'Present', value: presentToday },
        { name: 'Absent', value: absentToday },
        { name: 'Half Day', value: halfDayToday },
        { name: 'On Leave', value: attendance.filter(a => a.status === 'leave').length },
    ];

    const leaveCols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || '—' },
        { key: 'type', label: 'Leave Type', render: r => <span style={{ textTransform: 'capitalize' }}>{r.type}</span> },
        { key: 'startDate', label: 'From', render: r => formatDate(r.startDate) },
        { key: 'days', label: 'Days', render: r => <strong>{r.days}</strong> },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Supervisor Dashboard</h1>
                    <p className="page-subtitle">Welcome, {user?.name} — Team Overview</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/attendance')}>Mark Attendance</button>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Team Strength" value={employees.length} color="blue" />
                <StatCard label="Present Today" value={presentToday} color="green" />
                <StatCard label="Absent Today" value={absentToday} color="red" />
                <StatCard label="Pending Leaves" value={pendingLeaves.length} color="yellow" />
            </div>

            <div className="charts-grid" style={{ marginBottom: 24 }}>
                <ChartCard title="Today's Attendance" type="bar" data={attChartData} dataKeys={['value']} xKey="name" />
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Pending Leave Requests</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/leaves/approval')}>
                        Review All
                    </button>
                </div>
                <DataTable
                    columns={leaveCols}
                    data={pendingLeaves.slice(0, 5)}
                    emptyText="No pending leave requests."
                />
            </div>
        </div>
    );
}
