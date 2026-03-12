import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../controllers/hooks/useFetch';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDate, formatMonthYear } from '../../../utils/formatters';
import { useAuth } from '../../../controllers/context/AuthContext';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const now = new Date();

    const { data: empData } = useFetch('/employees');
    const { data: attData } = useFetch('/attendance', { month: now.getMonth() + 1, year: now.getFullYear() });
    const { data: leaveData } = useFetch('/leaves');
    const { data: payrollData } = useFetch('/payroll');

    const employees = empData?.employees || [];
    const attendance = attData?.attendance || [];
    const leaves = leaveData?.leaves || [];
    const payrolls = payrollData?.payrolls || [];

    const myEmployee = useMemo(() => employees.find(e => e.email === user?.email), [employees, user]);
    const myId = myEmployee?._id;

    const myAtt = useMemo(() => myId ? attendance.filter(a => (a.employee?._id || a.employee) === myId) : [], [attendance, myId]);
    const myLeaves = useMemo(() => myId ? leaves.filter(l => (l.employee?._id || l.employee) === myId) : [], [leaves, myId]);
    const myPayrolls = useMemo(() => myId ? payrolls.filter(p => (p.employee?._id || p.employee) === myId) : [], [payrolls, myId]);

    const presentDays = myAtt.filter(a => a.status === 'present').length;
    const absentDays = myAtt.filter(a => a.status === 'absent').length;
    const approvedLeaves = myLeaves.filter(l => l.status === 'approved').reduce((s, l) => s + (l.days || 0), 0);
    const latestSlip = myPayrolls[0];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Dashboard</h1>
                    <p className="page-subtitle">Welcome, {user?.name}</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/leaves')}>Apply for Leave</button>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Days Present (Month)" value={presentDays} color="green" />
                <StatCard label="Days Absent (Month)" value={absentDays} color="red" />
                <StatCard label="Leave Days Taken" value={approvedLeaves} color="yellow" />
                <StatCard label="Last Net Pay" value={latestSlip ? formatCurrency(latestSlip.netPay) : '—'} color="blue" />
            </div>

            <div className="quick-grid-2">
                {/* My Leave History */}
                <div className="card">
                    <div className="card-header">
                        <h3>My Leave Applications</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate('/leaves')}>Apply</button>
                    </div>
                    <div className="table-scroll">
                        <table className="datatable">
                            <thead>
                                <tr><th>Type</th><th>From</th><th>Days</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {myLeaves.length === 0
                                    ? <tr><td colSpan={4} className="empty-row">No leave records.</td></tr>
                                    : myLeaves.slice(0, 5).map(l => (
                                        <tr key={l._id}>
                                            <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>{l.type}</td>
                                            <td>{formatDate(l.startDate)}</td>
                                            <td><strong>{l.days}</strong></td>
                                            <td><StatusBadge value={l.status} /></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* My Salary Slips */}
                <div className="card">
                    <div className="card-header">
                        <h3>My Salary Slips</h3>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/salary-slips')}>View All</button>
                    </div>
                    <div className="table-scroll">
                        <table className="datatable">
                            <thead>
                                <tr><th>Period</th><th>Net Pay</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {myPayrolls.length === 0
                                    ? <tr><td colSpan={3} className="empty-row">No salary slips.</td></tr>
                                    : myPayrolls.slice(0, 5).map(p => (
                                        <tr key={p._id}>
                                            <td>{formatMonthYear(p.month, p.year)}</td>
                                            <td><strong className="text-success">{formatCurrency(p.netPay)}</strong></td>
                                            <td><StatusBadge value={p.status} /></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
