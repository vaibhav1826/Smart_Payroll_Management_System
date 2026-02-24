import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const EMPTY = { name: '', email: '', phone: '', company: '', industry: '', status: 'active' };

export default function ContractorList() {
    const { data, loading, refresh } = useFetch('/contractors');
    const { data: indData } = useFetch('/industries');
    const contractors = data?.contractors || [];
    const industries = indData?.industries || [];

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('form'); };
    const openEdit = (row) => { setForm({ ...row, industry: row.industry?._id || row.industry || '' }); setEditing(row._id); setModal('form'); };
    const closeModal = () => { setModal(null); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editing) { await api.put(`/contractors/${editing}`, form); toast.success('Contractor updated.'); }
            else { await api.post('/contractors', form); toast.success('Contractor created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/contractors/${deleting}`); toast.success('Contractor deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'name', label: 'Name' },
        { key: 'company', label: 'Company' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'industry', label: 'Industry', render: r => r.industry?.name || '—' },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
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
                <h1 className="page-title">🤝 Contractors</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Contractor</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={contractors} loading={loading} searchable emptyText="No contractors yet." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Contractor' : 'Add Contractor'} onClose={closeModal} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="Name" name="name" value={form.name} onChange={onChange} required />
                            <FormField label="Company" name="company" value={form.company} onChange={onChange} />
                            <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} />
                            <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} />
                            <FormField label="Industry" name="industry" type="select" value={form.industry} onChange={onChange}
                                options={industries.map(i => ({ value: i._id, label: i.name }))} />
                            <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete this contractor?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
