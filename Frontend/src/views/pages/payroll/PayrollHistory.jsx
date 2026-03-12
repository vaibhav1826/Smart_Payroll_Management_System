import React, { useState } from 'react';
import { useFetch } from '../../../controllers/hooks/useFetch';
import { api } from '../../../models/api';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatMonthYear } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export default function PayrollHistory() {
    const [params, setParams] = useState({});
    const { data, loading, refresh } = useFetch('/payroll', params);
    const payrolls = data?.payrolls || [];
    const [locking, setLocking] = useState(null);

    const lockPayroll = async (id) => {
        setLocking(id);
        try {
            await api.put(`/payroll/${id}/lock`, {});
            toast.success('Payroll locked.');
            refresh();
        } catch (err) { toast.error(err.message); }
        finally { setLocking(null); }
    };

    const cols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || '—' },
        { key: 'department', label: 'Dept', render: r => r.employee?.department || '—' },
        { key: 'period', label: 'Period', render: r => formatMonthYear(r.month, r.year) },
        { key: 'presentDays', label: 'Days Present' },
        { key: 'grossPay', label: 'Gross', render: r => formatCurrency(r.grossPay) },
        { key: 'deductions', label: 'Deductions', render: r => formatCurrency(r.deductions) },
        { key: 'netPay', label: 'Net Pay', render: r => <strong style={{ color: 'var(--success)' }}>{formatCurrency(r.netPay)}</strong> },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        {
            key: 'actions', label: '', sortable: false, render: r => r.status !== 'locked' ? (
                <button className="btn btn-sm btn-ghost" disabled={locking === r._id} onClick={() => lockPayroll(r._id)}>
                    {locking === r._id ? '…' : '🔒 Lock'}
                </button>
            ) : <span className="text-muted text-sm">Locked</span>
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💳 Payroll History</h1>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Month</label>
                        <select className="form-input" style={{ width: 140 }} value={params.month || ''} onChange={e => setParams(p => ({ ...p, month: e.target.value || undefined }))}>
                            <option value="">All months</option>
                            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Year</label>
                        <select className="form-input" style={{ width: 100 }} value={params.year || ''} onChange={e => setParams(p => ({ ...p, year: e.target.value || undefined }))}>
                            <option value="">All</option>
                            {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Status</label>
                        <select className="form-input" style={{ width: 130 }} value={params.status || ''} onChange={e => setParams(p => ({ ...p, status: e.target.value || undefined }))}>
                            <option value="">All</option>
                            {['draft', 'generated', 'locked'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setParams({})}>Clear</button>
                </div>
            </div>
            <div className="card">
                <DataTable columns={cols} data={payrolls} loading={loading} emptyText="No payroll records found." />
            </div>
        </div>
    );
}
