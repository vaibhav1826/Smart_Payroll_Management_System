import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const today = new Date().toISOString().slice(0, 10);
const EMPTY = { employee: '', date: today, status: 'present', checkIn: '', checkOut: '', overtime: 0, notes: '' };

export default function AttendanceMark() {
    const navigate = useNavigate();
    const [params, setParams] = useState({ date: today });
    const { data, loading, refresh } = useFetch('/attendance', params);
    const { data: empData } = useFetch('/employees');
    const { data: shiftData } = useFetch('/shifts');
    const records = data?.attendance || [];
    const employees = empData?.employees || [];
    const shifts = shiftData?.shifts || [];

    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const openMark = (row = null) => {
        setForm(row ? { ...row, employee: row.employee?._id || row.employee, shift: row.shift?._id || '', date: row.date?.slice(0, 10) } : EMPTY);
        setModal(true);
    };

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            await api.post('/attendance', form);
            toast.success('Attendance marked.'); refresh(); setModal(false);
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async (id) => {
        try { await api.delete(`/attendance/${id}`); toast.success('Deleted.'); refresh(); }
        catch (err) { toast.error(err.message); }
    };

    const cols = [
        { key: 'employee', label: 'Employee', render: r => r.employee?.name || '—' },
        { key: 'date', label: 'Date', render: r => formatDate(r.date) },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        { key: 'checkIn', label: 'Check In' },
        { key: 'checkOut', label: 'Check Out' },
        { key: 'overtime', label: 'OT (hrs)' },
        { key: 'shift', label: 'Shift', render: r => r.shift?.name || '—' },
        {
            key: 'actions', label: '', sortable: false, render: r => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openMark(r)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(r._id)}>🗑️</button>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📋 Attendance</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" onClick={() => navigate('/attendance/bulk')}>Bulk Entry</button>
                    <button className="btn btn-primary" onClick={() => openMark()}>+ Mark Attendance</button>
                </div>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <label className="form-label">Filter by Date:</label>
                    <input type="date" className="form-input" style={{ width: 180 }} value={params.date}
                        onChange={e => setParams(p => ({ ...p, date: e.target.value }))} />
                    <button className="btn btn-ghost btn-sm" onClick={() => setParams({ date: today })}>Today</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setParams({})}>All</button>
                </div>
            </div>
            <div className="card">
                <DataTable columns={cols} data={records} loading={loading} emptyText="No attendance records." />
            </div>

            {modal && (
                <Modal title="Mark Attendance" onClose={() => setModal(false)} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="Employee" name="employee" type="select" value={form.employee} onChange={onChange} required
                                options={employees.map(e => ({ value: e._id, label: e.name }))} />
                            <FormField label="Date" name="date" type="date" value={form.date} onChange={onChange} required />
                            <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                options={['present', 'absent', 'halfDay', 'leave'].map(s => ({ value: s, label: s }))} />
                            <FormField label="Shift" name="shift" type="select" value={form.shift || ''} onChange={onChange}
                                options={shifts.map(s => ({ value: s._id, label: s.name }))} />
                            <FormField label="Check In" name="checkIn" value={form.checkIn} onChange={onChange} placeholder="09:00" />
                            <FormField label="Check Out" name="checkOut" value={form.checkOut} onChange={onChange} placeholder="18:00" />
                            <FormField label="Overtime (h)" name="overtime" type="number" value={form.overtime} onChange={onChange} />
                        </div>
                        <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={onChange} rows={2} />
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Mark'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
