import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import { formatCurrency } from '../../utils/formatters';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const { data: empData } = useFetch('/employees');
    const { data: attData } = useFetch('/attendance', { month, year });
    const { data: leaveData } = useFetch('/leaves', { status: 'pending' });
    const { data: payrollData } = useFetch('/payroll', { month, year });

    const employees = empData?.employees || [];
    const attendance = attData?.attendance || [];
    const pendingLeaves = leaveData?.leaves?.length || 0;
    const payrolls = payrollData?.payrolls || [];

    const todaysAttendance = attendance.filter(a => a.date && new Date(a.date).toDateString() === now.toDateString());

    const presentToday = todaysAttendance.filter(a => a.status === 'present').length;
    const explicitAbsent = todaysAttendance.filter(a => a.status === 'absent').length;
    // Employees with NO attendance record for today are also considered absent
    const markedEmployeeIds = new Set(todaysAttendance.map(a => a.employee?._id || a.employee));
    const implicitAbsent = employees.filter(e => e.status === 'active' && !markedEmployeeIds.has(String(e._id))).length;
    const absentToday = explicitAbsent + implicitAbsent;
    const totalNetPayroll = payrolls.reduce((s, p) => s + (p.netPay || 0), 0);

    const deptData = useMemo(() => {
        const map = {};
        employees.forEach(e => { const d = e.department || 'Other'; map[d] = (map[d] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [employees]);

    const attChartData = [
        { name: 'Present', value: presentToday },
        { name: 'Absent', value: absentToday },
        { name: 'Half Day', value: todaysAttendance.filter(a => a.status === 'halfDay').length },
        { name: 'On Leave', value: todaysAttendance.filter(a => a.status === 'leave').length },
    ];

    const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">{monthLabel} — System Overview</p>
                </div>
            </div>

            {/* Top KPI Row */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Total Employees" value={employees.length} color="blue" />
                <StatCard label="Active Employees" value={employees.filter(e => e.status === 'active').length} color="cyan" />
                <StatCard label="Present Today" value={presentToday} color="green" />
                <StatCard label="Payroll This Month" value={formatCurrency(totalNetPayroll)} color="purple" />
            </div>

            {/* Secondary KPIs */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Absent Today" value={absentToday} color="red" />
                <StatCard label="Pending Leaves" value={pendingLeaves} color="yellow" />
                <StatCard label="On Leave Today" value={todaysAttendance.filter(a => a.status === 'leave').length} color="orange" />
                <StatCard label="Total Departments" value={deptData.length} color="blue" />
            </div>

            {/* Charts */}
            <div className="charts-grid" style={{ marginBottom: 24 }}>
                <ChartCard title="Today's Attendance" type="bar" data={attChartData} dataKeys={['value']} xKey="name" />
                <ChartCard title="Employees by Department" type="pie" data={deptData} dataKeys={['value']} xKey="name" />
            </div>

            {/* Quick Overview Table & Actions */}
            <div className="charts-grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
                <div className="chart-card">
                    <h4 className="chart-title" style={{ marginBottom: 12 }}>Recent Employees</h4>
                    <div className="table-scroll">
                        <table className="datatable" style={{ minWidth: 400 }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.slice(-5).reverse().map(e => (
                                    <tr key={e._id}>
                                        <td style={{ fontWeight: 600, color: '#111827' }}>{e.name}</td>
                                        <td>{e.department || '—'}</td>
                                        <td>
                                            <span className={`status-badge status-${e.status}`}>{e.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div
                        className="card quick-card"
                        onClick={() => navigate('/leaves/approval')}
                        style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-light)' }}
                    >
                        <div className="card-header" style={{ paddingBottom: 8 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Required</h4>
                        </div>
                        <p className="quick-value text-warning" style={{ fontSize: '2rem', fontWeight: 800 }}>{pendingLeaves} Leaves</p>
                        <p className="text-muted text-sm" style={{ marginTop: 6 }}>Click to review and approve</p>
                    </div>

                    <div
                        className="card quick-card"
                        onClick={() => navigate('/payroll')}
                        style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-light)' }}
                    >
                        <div className="card-header" style={{ paddingBottom: 8 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Disbursed</h4>
                        </div>
                        <p className="quick-value text-success" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatCurrency(totalNetPayroll)}</p>
                        <p className="text-muted text-sm" style={{ marginTop: 6 }}>Across {payrolls.length} salary slips</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
