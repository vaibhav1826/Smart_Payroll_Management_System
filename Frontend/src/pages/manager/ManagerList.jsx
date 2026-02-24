import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
    // User account fields
    name: '', email: '', password: '',
    // Manager assignment fields
    industry: '', department: '', phone: '', status: 'active',
};

export default function ManagerList() {
    const { data, loading, refresh } = useFetch('/managers');
    const { data: indData } = useFetch('/industries');
    const managers = data?.managers || [];
    const industries = indData?.industries || [];

    const [modal, setModal] = useState(null);   // 'create' | 'edit'
    const [form, setForm] = useState(EMPTY_FORM);
    const [editing, setEditing] = useState(null);   // manager._id when editing
    const [deleting, setDeleting] = useState(null);   // manager._id to delete
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditing(null);
        setShowPass(true);   // password required on create
        setModal('create');
    };

    const openEdit = (row) => {
        setForm({
            name: row.user?.name || '',
            email: row.user?.email || '',
            password: '',              // leave blank = no change
            industry: row.industry?._id || '',
            department: row.department || '',
            phone: row.phone || '',
            status: row.status || 'active',
        });
        setEditing(row._id);
        setShowPass(false);   // password change optional on edit
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    /* ── CREATE: make user account then create manager record ── */
    const onCreate = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            return toast.error('Name, email and password are required.');
        }
        if (!form.industry) {
            return toast.error('Please select an industry.');
        }
        setSaving(true);
        try {
            // Step 1 – create the user account with manager role
            const userResp = await api.post('/auth/users', {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: 'manager',
            });
            const userId = userResp.user._id;

            // Step 2 – create the manager record linked to that user
            await api.post('/managers', {
                user: userId,
                industry: form.industry,
                department: form.department,
                phone: form.phone,
                status: form.status,
            });

            toast.success(`Manager "${form.name}" created successfully.`);
            refresh();
            closeModal();
        } catch (err) {
            toast.error(err.message || 'Failed to create manager.');
        } finally {
            setSaving(false);
        }
    };

    /* ── EDIT: update user account details + manager assignment ── */
    const onEdit = async (e) => {
        e.preventDefault();
        if (!form.industry) return toast.error('Please select an industry.');
        setSaving(true);
        try {
            // Find the existing manager to get user._id
            const mgr = managers.find(m => m._id === editing);
            const userId = mgr?.user?._id;

            // Step 1 – update user account (only changed fields)
            const userPayload = { name: form.name, email: form.email };
            if (form.password.trim()) userPayload.password = form.password;
            if (userId) await api.put(`/auth/users/${userId}`, userPayload);

            // Step 2 – update manager record
            await api.put(`/managers/${editing}`, {
                industry: form.industry,
                department: form.department,
                phone: form.phone,
                status: form.status,
            });

            toast.success('Manager updated.');
            refresh();
            closeModal();
        } catch (err) {
            toast.error(err.message || 'Failed to update manager.');
        } finally {
            setSaving(false);
        }
    };

    /* ── DELETE: remove manager record (user account kept for audit) ── */
    const onDelete = async () => {
        setSaving(true);
        try {
            await api.delete(`/managers/${deleting}`);
            toast.success('Manager removed.');
            refresh();
            setDeleting(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const cols = [
        { key: 'user', label: 'Manager Name', render: r => <strong>{r.user?.name || '—'}</strong> },
        { key: 'email', label: 'Email', render: r => r.user?.email || '—' },
        { key: 'industry', label: 'Industry', render: r => r.industry?.name || '—' },
        { key: 'department', label: 'Department' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
        {
            key: 'actions', label: '', sortable: false, render: r => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleting(r._id)}>🗑️</button>
                </div>
            ),
        },
    ];

    const isCreate = modal === 'create';

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                            <circle cx="12" cy="7" r="4" />
                            <path d="M2 21v-2a7 7 0 0114 0v2" />
                            <path d="M19 10l2 2-2 2" />
                        </svg>
                        Managers
                    </h1>
                    <p className="page-subtitle">Create manager accounts and assign them to industries</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Manager</button>
            </div>

            {/* Table */}
            <div className="card">
                <DataTable
                    columns={cols}
                    data={managers}
                    loading={loading}
                    searchable
                    emptyText="No managers yet. Click '+ Add Manager' to create one."
                />
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <Modal
                    title={isCreate ? 'Create Manager Account' : 'Edit Manager'}
                    onClose={closeModal}
                    size="md"
                >
                    <form onSubmit={isCreate ? onCreate : onEdit}>
                        {/* ── Login Credentials ── */}
                        <div style={{ marginBottom: 16 }}>
                            <div className="card-header" style={{ marginBottom: 12 }}>
                                <h4 style={{ color: 'var(--text-primary)' }}>
                                    🔐 {isCreate ? 'Login Credentials (auto-assigned manager role)' : 'Account Details'}
                                </h4>
                            </div>
                            <div className="form-grid">
                                <FormField label="Full Name" name="name" value={form.name} onChange={onChange} required placeholder="e.g. Rajesh Kumar" />
                                <FormField label="Email / Username" name="email" type="email" value={form.email} onChange={onChange} required placeholder="e.g. rajesh@company.com" />
                                <FormField
                                    label={isCreate ? 'Password' : 'New Password (leave blank to keep)'}
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={onChange}
                                    required={isCreate}
                                    placeholder={isCreate ? 'Min 6 characters' : 'Leave blank to keep existing'}
                                />
                            </div>
                        </div>

                        {/* ── Assignment ── */}
                        <div>
                            <div className="card-header" style={{ marginBottom: 12 }}>
                                <h4 style={{ color: 'var(--text-primary)' }}>🏭 Industry Assignment</h4>
                            </div>
                            <div className="form-grid">
                                <FormField
                                    label="Assign to Industry"
                                    name="industry"
                                    type="select"
                                    value={form.industry}
                                    onChange={onChange}
                                    required
                                    options={industries.map(i => ({ value: i._id, label: i.name }))}
                                />
                                <FormField label="Department" name="department" value={form.department} onChange={onChange} placeholder="e.g. Production" />
                                <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" />
                                <FormField
                                    label="Status"
                                    name="status"
                                    type="select"
                                    value={form.status}
                                    onChange={onChange}
                                    options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
                                />
                            </div>
                        </div>

                        {/* Info note */}
                        {isCreate && (
                            <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--info-light)', borderRadius: 8, border: '1px solid rgba(29,78,216,0.2)', fontSize: 12, color: 'var(--info)' }}>
                                ℹ️ A new user account with <strong>Manager</strong> role will be created. The manager can log in using the email and password you set here.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="form-actions" style={{ marginTop: 20 }}>
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving…' : isCreate ? 'Create Manager' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && (
                <ConfirmDialog
                    message="Remove this manager? Their login account will remain but they will no longer have manager access."
                    onConfirm={onDelete}
                    onCancel={() => setDeleting(null)}
                    loading={saving}
                />
            )}
        </div>
    );
}
