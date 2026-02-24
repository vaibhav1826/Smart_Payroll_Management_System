import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const EMPTY = { name: '', code: '', description: '', address: '', contactPerson: '', contactPhone: '', status: 'active' };

export default function IndustryList() {
    const { data, loading, refresh } = useFetch('/industries');
    const industries = data?.industries || [];
    const [modal, setModal] = useState(null); // 'create' | 'edit'
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('form'); };
    const openEdit = (row) => { setForm({ ...row }); setEditing(row._id); setModal('form'); };
    const closeModal = () => { setModal(null); setEditing(null); };

    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) { await api.put(`/industries/${editing}`, form); toast.success('Industry updated.'); }
            else { await api.post('/industries', form); toast.success('Industry created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/industries/${deleting}`); toast.success('Industry deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'contactPerson', label: 'Contact Person' },
        { key: 'contactPhone', label: 'Phone' },
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
                <h1 className="page-title">🏭 Industries</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Industry</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={industries} loading={loading} searchable emptyText="No industries yet." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Industry' : 'Add Industry'} onClose={closeModal} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="Name" name="name" value={form.name} onChange={onChange} required />
                            <FormField label="Code" name="code" value={form.code} onChange={onChange} />
                            <FormField label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={onChange} />
                            <FormField label="Contact Phone" name="contactPhone" value={form.contactPhone} onChange={onChange} />
                            <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                            <FormField label="Address" name="address" value={form.address} onChange={onChange} />
                        </div>
                        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={onChange} />
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete this industry?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
