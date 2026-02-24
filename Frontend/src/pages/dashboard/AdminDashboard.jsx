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
    const { data: indData } = useFetch('/industries');
    const { data: conData } = useFetch('/contractors');
    const { data: attData } = useFetch('/attendance', { month, year });
    const { data: leaveData } = useFetch('/leaves', { status: 'pending' });
    const { data: payrollData } = useFetch('/payroll', { month, year });

    const employees = empData?.employees || [];
    const industries = indData?.industries || [];
    const contractors = conData?.contractors || [];
    const attendance = attData?.attendance || [];
    const pendingLeaves = leaveData?.leaves?.length || 0;
    const payrolls = payrollData?.payrolls || [];

    const presentToday = attendance.filter(a => a.status === 'present').length;
    const absentToday = attendance.filter(a => a.status === 'absent').length;
    const totalNetPayroll = payrolls.reduce((s, p) => s + (p.netPay || 0), 0);

    const deptData = useMemo(() => {
        const map = {};
        employees.forEach(e => { const d = e.department || 'Other'; map[d] = (map[d] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [employees]);

    const attChartData = [
        { name: 'Present', value: presentToday },
        { name: 'Absent', value: absentToday },
        { name: 'Half Day', value: attendance.filter(a => a.status === 'halfDay').length },
        { name: 'On Leave', value: attendance.filter(a => a.status === 'leave').length },
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

            {/* KPI Cards */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Total Employees" value={employees.length} color="blue" />
                <StatCard label="Industries" value={industries.length} color="red" />
                <StatCard label="Contractors" value={contractors.length} color="purple" />
                <StatCard label="Pending Leaves" value={pendingLeaves} color="yellow" />
                <StatCard label="Present Today" value={presentToday} color="green" />
                <StatCard label="Absent Today" value={absentToday} color="red" />
                <StatCard label="Payroll This Month" value={formatCurrency(totalNetPayroll)} color="green" />
                <StatCard label="Active Employees" value={employees.filter(e => e.status === 'active').length} color="cyan" />
            </div>

            {/* Charts */}
            <div className="charts-grid" style={{ marginBottom: 24 }}>
                <ChartCard title="Today's Attendance" type="bar" data={attChartData} dataKeys={['value']} xKey="name" />
                <ChartCard title="Employees by Department" type="pie" data={deptData} dataKeys={['value']} xKey="name" />
            </div>

            {/* Quick Action Cards */}
            <div className="quick-grid-2">
                <div
                    className="card quick-card"
                    onClick={() => navigate('/leaves/approval')}
                >
                    <div className="card-header" style={{ paddingBottom: 8 }}>
                        <h4>Pending Leave Approvals</h4>
                        <span className="badge badge-yellow">{pendingLeaves} pending</span>
                    </div>
                    <p className="quick-value text-warning" style={{ fontSize: '2.2rem', fontWeight: 800 }}>{pendingLeaves}</p>
                    <p className="text-muted text-sm" style={{ marginTop: 6 }}>Click to review and approve</p>
                </div>
                <div
                    className="card quick-card"
                    onClick={() => navigate('/payroll')}
                >
                    <div className="card-header" style={{ paddingBottom: 8 }}>
                        <h4>Monthly Payroll Disbursed</h4>
                        <span className="badge badge-green">{payrolls.length} slips</span>
                    </div>
                    <p className="quick-value text-success" style={{ fontSize: '1.7rem', fontWeight: 800 }}>{formatCurrency(totalNetPayroll)}</p>
                    <p className="text-muted text-sm" style={{ marginTop: 6 }}>Click to generate or view payroll</p>
                </div>
            </div>
        </div>
    );
}
