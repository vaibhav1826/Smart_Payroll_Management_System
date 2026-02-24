import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const EMPTY = { name: '', startTime: '09:00', endTime: '18:00', breakDuration: 30, isActive: true };

export default function ShiftManagement() {
    const { data, loading, refresh } = useFetch('/shifts');
    const shifts = data?.shifts || [];
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true); };
    const openEdit = (r) => { setForm({ ...r, isActive: r.isActive ?? true }); setEditing(r._id); setModal(true); };
    const closeModal = () => { setModal(false); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editing) { await api.put(`/shifts/${editing}`, form); toast.success('Shift updated.'); }
            else { await api.post('/shifts', form); toast.success('Shift created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/shifts/${deleting}`); toast.success('Shift deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'name', label: 'Name' },
        { key: 'startTime', label: 'Start' },
        { key: 'endTime', label: 'End' },
        { key: 'breakDuration', label: 'Break (min)' },
        { key: 'isActive', label: 'Active', render: r => <StatusBadge value={r.isActive ? 'active' : 'inactive'} /> },
        {
            key: 'actions', label: '', sortable: false, render: r => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleting(r._id)}>🗑️</button>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🕐 Shift Management</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Shift</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={shifts} loading={loading} emptyText="No shifts defined." />
            </div>
            {modal && (
                <Modal title={editing ? 'Edit Shift' : 'Add Shift'} onClose={closeModal} size="sm">
                    <form onSubmit={onSave}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <FormField label="Shift Name" name="name" value={form.name} onChange={onChange} required />
                            <FormField label="Start Time" name="startTime" value={form.startTime} onChange={onChange} />
                            <FormField label="End Time" name="endTime" value={form.endTime} onChange={onChange} />
                            <FormField label="Break (min)" name="breakDuration" type="number" value={form.breakDuration} onChange={onChange} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}
            {deleting && <ConfirmDialog message="Delete this shift?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
