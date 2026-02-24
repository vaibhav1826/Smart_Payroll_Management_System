import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = { type: 'casual', startDate: '', endDate: '', days: 1, reason: '' };

export default function LeaveApply() {
    const { user } = useAuth();
    const { data: empData } = useFetch('/employees');
    const employees = empData?.employees || [];

    const myEmployee = employees.find(e => e.email === user?.email);
    const [params, setParams] = useState({});
    const { data, loading, refresh } = useFetch('/leaves', params);
    const leaves = data?.leaves || [];

    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (!myEmployee) throw new Error('Your employee profile was not found.');
            const payload = { ...form, employee: myEmployee._id };
            await api.post('/leaves', payload);
            toast.success('Leave application submitted!');
            refresh(); setModal(false); setForm(EMPTY);
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || user?.name || '—' },
        { key: 'type', label: 'Type', render: r => <span style={{ textTransform: 'capitalize' }}>{r.type}</span> },
        { key: 'startDate', label: 'From', render: r => formatDate(r.startDate) },
        { key: 'endDate', label: 'To', render: r => formatDate(r.endDate) },
        { key: 'days', label: 'Days' },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        { key: 'reason', label: 'Reason' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🌿 Leave Applications</h1>
                <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}>+ Apply Leave</button>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormField label="Status filter" name="status" type="select" value={params.status || ''} onChange={e => setParams(p => ({ ...p, status: e.target.value || undefined }))}
                        options={['pending', 'approved', 'rejected'].map(s => ({ value: s, label: s }))} />
                    <button className="btn btn-ghost btn-sm" onClick={() => setParams({})}>Clear</button>
                </div>
            </div>
            <div className="card">
                <DataTable columns={cols} data={leaves} loading={loading} emptyText="No leave records." />
            </div>

            {modal && (
                <Modal title="Apply for Leave" onClose={() => setModal(false)} size="md">
                    <form onSubmit={onSubmit}>
                        <div className="form-grid">
                            <FormField label="Leave Type" name="type" type="select" value={form.type} onChange={onChange}
                                options={['casual', 'sick', 'earned', 'unpaid'].map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
                            <FormField label="Number of Days" name="days" type="number" value={form.days} onChange={onChange} />
                            <FormField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={onChange} required />
                            <FormField label="End Date" name="endDate" type="date" value={form.endDate} onChange={onChange} required />
                        </div>
                        <FormField label="Reason" name="reason" type="textarea" value={form.reason} onChange={onChange} rows={3} />
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
