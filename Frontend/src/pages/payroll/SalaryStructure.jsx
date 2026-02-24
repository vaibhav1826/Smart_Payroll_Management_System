import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

const EMPTY = { designation: '', basicPercent: 50, hraPercent: 20, daPercent: 10, pfPercent: 12, otherAllowances: 0 };

export default function SalaryStructure() {
    const { data, loading, refresh } = useFetch('/salary-structures');
    const structures = data?.structures || [];
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true); };
    const openEdit = (r) => { setForm({ ...r }); setEditing(r._id); setModal(true); };
    const closeModal = () => { setModal(false); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, basicPercent: +form.basicPercent, hraPercent: +form.hraPercent, daPercent: +form.daPercent, pfPercent: +form.pfPercent, otherAllowances: +form.otherAllowances };
            if (editing) { await api.put(`/salary-structures/${editing}`, payload); toast.success('Updated.'); }
            else { await api.post('/salary-structures', payload); toast.success('Created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/salary-structures/${deleting}`); toast.success('Deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'designation', label: 'Designation' },
        { key: 'basicPercent', label: 'Basic %' },
        { key: 'hraPercent', label: 'HRA %' },
        { key: 'daPercent', label: 'DA %' },
        { key: 'pfPercent', label: 'PF %' },
        { key: 'otherAllowances', label: 'Other (₹)' },
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
                <h1 className="page-title">💰 Salary Structures</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Structure</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={structures} loading={loading} emptyText="No salary structures defined." />
            </div>
            {modal && (
                <Modal title={editing ? 'Edit Structure' : 'Add Salary Structure'} onClose={closeModal} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="Designation" name="designation" value={form.designation} onChange={onChange} required />
                            <FormField label="Basic %" name="basicPercent" type="number" value={form.basicPercent} onChange={onChange} />
                            <FormField label="HRA %" name="hraPercent" type="number" value={form.hraPercent} onChange={onChange} />
                            <FormField label="DA %" name="daPercent" type="number" value={form.daPercent} onChange={onChange} />
                            <FormField label="PF %" name="pfPercent" type="number" value={form.pfPercent} onChange={onChange} />
                            <FormField label="Other Allow. ₹" name="otherAllowances" type="number" value={form.otherAllowances} onChange={onChange} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}
            {deleting && <ConfirmDialog message="Delete this salary structure?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
