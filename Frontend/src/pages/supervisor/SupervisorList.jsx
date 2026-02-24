import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

const EMPTY = { user: '', industry: '', department: '', employees: [] };

export default function SupervisorList() {
    const { data, loading, refresh } = useFetch('/supervisors');
    const { data: usersData } = useFetch('/auth/users', { role: 'supervisor' });
    const { data: indData } = useFetch('/industries');
    const supervisors = data?.supervisors || [];
    const users = usersData?.users || [];
    const industries = indData?.industries || [];

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('form'); };
    const openEdit = (row) => {
        setForm({ user: row.user?._id || '', industry: row.industry?._id || '', department: row.department || '', employees: [] });
        setEditing(row._id); setModal('form');
    };
    const closeModal = () => { setModal(null); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editing) { await api.put(`/supervisors/${editing}`, form); toast.success('Supervisor updated.'); }
            else { await api.post('/supervisors', form); toast.success('Supervisor created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/supervisors/${deleting}`); toast.success('Supervisor deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'user', label: 'User', render: r => r.user?.name || '—' },
        { key: 'industry', label: 'Industry', render: r => r.industry?.name || '—' },
        { key: 'department', label: 'Department' },
        { key: 'employees', label: 'Employees', render: r => r.employees?.length || 0 },
        {
            key: 'actions', label: '', sortable: false, render: r => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleting(r._id)}>🗑️</button>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">👤 Supervisors</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Supervisor</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={supervisors} loading={loading} emptyText="No supervisors yet." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Supervisor' : 'Add Supervisor'} onClose={closeModal} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="User" name="user" type="select" value={form.user} onChange={onChange} required
                                options={users.map(u => ({ value: u._id, label: u.name }))} />
                            <FormField label="Industry" name="industry" type="select" value={form.industry} onChange={onChange}
                                options={industries.map(i => ({ value: i._id, label: i.name }))} />
                            <FormField label="Department" name="department" value={form.department} onChange={onChange} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete supervisor?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
