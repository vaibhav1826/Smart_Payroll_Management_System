import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function LeaveApproval() {
    const { data, loading, refresh } = useFetch('/leaves', { status: 'pending' });
    const leaves = data?.leaves || [];

    const decide = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            toast.success(`Leave ${status}.`);
            refresh();
        } catch (err) { toast.error(err.message); }
    };

    const cols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || '—' },
        { key: 'type', label: 'Type', render: r => <span style={{ textTransform: 'capitalize' }}>{r.type}</span> },
        { key: 'startDate', label: 'From', render: r => formatDate(r.startDate) },
        { key: 'endDate', label: 'To', render: r => formatDate(r.endDate) },
        { key: 'days', label: 'Days' },
        { key: 'reason', label: 'Reason' },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        {
            key: 'actions', label: '', sortable: false, render: r => r.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-success" onClick={() => decide(r._id, 'approved')}>✅ Approve</button>
                    <button className="btn btn-sm btn-danger" onClick={() => decide(r._id, 'rejected')}>❌ Reject</button>
                </div>
            ) : null
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🌿 Leave Approvals</h1>
                <span className="badge badge-yellow">{leaves.length} pending</span>
            </div>
            <div className="card">
                <DataTable columns={cols} data={leaves} loading={loading} emptyText="No pending leave requests." />
            </div>
        </div>
    );
}
