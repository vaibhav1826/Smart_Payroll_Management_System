import React, { useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import StatCard from '../../components/StatCard';

export default function LeaveBalance() {
    const { data: empData } = useFetch('/employees');
    const { data: leaveData } = useFetch('/leaves', { status: 'approved' });
    const employees = empData?.employees || [];
    const leaves = leaveData?.leaves || [];

    // Build per-employee leave balance summary
    const summary = useMemo(() => {
        return employees.map(emp => {
            const empLeaves = leaves.filter(l => (l.employee?._id || l.employee) === emp._id);
            const taken = (type) => empLeaves.filter(l => l.type === type).reduce((s, l) => s + (l.days || 0), 0);
            return {
                _id: emp._id, name: emp.name, department: emp.department || '—',
                casual: taken('casual'), sick: taken('sick'), earned: taken('earned'), unpaid: taken('unpaid'),
                total: empLeaves.reduce((s, l) => s + (l.days || 0), 0),
            };
        });
    }, [employees, leaves]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🌿 Leave Balance</h1>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Total Employees" value={employees.length} icon="👥" color="blue" />
                <StatCard label="Approved Leaves" value={leaves.length} icon="✅" color="green" />
                <StatCard label="Casual Days Taken" value={leaves.filter(l => l.type === 'casual').reduce((s, l) => s + l.days, 0)} icon="🌴" color="yellow" />
                <StatCard label="Sick Days Taken" value={leaves.filter(l => l.type === 'sick').reduce((s, l) => s + l.days, 0)} icon="🤒" color="red" />
            </div>

            <div className="card">
                <div className="table-scroll">
                    <table className="datatable">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Casual</th>
                                <th>Sick</th>
                                <th>Earned</th>
                                <th>Unpaid</th>
                                <th>Total Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.length === 0
                                ? <tr><td colSpan={7} className="empty-row">No data available.</td></tr>
                                : summary.map(row => (
                                    <tr key={row._id}>
                                        <td style={{ fontWeight: 500 }}>{row.name}</td>
                                        <td>{row.department}</td>
                                        <td>{row.casual}</td>
                                        <td>{row.sick}</td>
                                        <td>{row.earned}</td>
                                        <td>{row.unpaid}</td>
                                        <td><strong>{row.total}</strong></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
