import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function DepartmentList() {
    const { data, loading, refresh } = useFetch('/departments');
    const departments = data?.departments || [];

    const [modal, setModal] = useState(null); // 'form' or 'view'
    const [form, setForm] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    // For Employee Drilldown
    const [activeDept, setActiveDept] = useState(null);
    const [deptEmployees, setDeptEmployees] = useState(null);
    const [loadingEmps, setLoadingEmps] = useState(false);

    const openCreate = () => { setForm({ name: '', description: '' }); setEditing(null); setModal('form'); };
    const openEdit = (row) => {
        setForm({ name: row.name, description: row.description || '' });
        setEditing(row._id); setModal('form');
    };
    const closeModal = () => { setModal(null); setEditing(null); setActiveDept(null); setDeptEmployees(null); };

    const fetchEmployees = async (dept) => {
        setActiveDept(dept);
        setModal('view');
        setLoadingEmps(true);
        try {
            const res = await api.get(`/departments/${dept._id}/employees`);
            setDeptEmployees(res.employees);
        } catch (err) {
            toast.error('Failed to load employees for this department.');
        } finally {
            setLoadingEmps(false);
        }
    }

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editing) { await api.put(`/departments/${editing}`, form); toast.success('Department updated.'); }
            else { await api.post('/departments', form); toast.success('Department created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.response?.data?.error || err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try {
            await api.delete(`/departments/${deleting}`);
            toast.success('Department deleted. Employees unassigned.');
            refresh(); setDeleting(null);
        }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        {
            key: 'name', label: 'Department Name', render: r => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(204,0,0,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M3 7l6-4v4M9 3v18M9 7l6-4v4M15 3v18M15 7l6-4v4M21 7v14" /></svg>
                    </div>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                </div>
            )
        },
        { key: 'description', label: 'Description', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.description || '-'}</span> },
        {
            key: 'employeeCount', label: 'Total Employees', render: r => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{r.employeeCount || 0}</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => fetchEmployees(r)}>View All ↗</button>
                </div>
            )
        },
        {
            key: 'actions', label: '', sortable: false, render: r => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(r)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                    </button>
                    <button className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setDeleting(r._id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                </div>
            )
        },
    ];

    const empCols = [
        { key: 'name', label: 'Employee Name' },
        { key: 'designation', label: 'Designation' },
        { key: 'employmentType', label: 'Type' },
        { key: 'branch', label: 'Branch' }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M4 22V8a2 2 0 012-2h4v16M14 22V4a2 2 0 012-2h4a2 2 0 012 2v18M14 10h4M14 14h4M4 14h4" /></svg>
                        Department Hub
                    </h1>
                    <p className="page-subtitle">Manage organizational hierarchy and view department rosters</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Department</button>
            </div>

            <div className="card">
                <DataTable columns={cols} data={departments} loading={loading} searchable emptyText="No departments configured." />
            </div>

            {/* CREATE / EDIT MODAL */}
            {modal === 'form' && (
                <Modal title={editing ? 'Edit Department' : 'Add Department'} onClose={closeModal} size="md">
                    <form onSubmit={onSave}>
                        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                            <FormField label="Department Name" name="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                            <FormField label="Description (Optional)" name="description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div className="form-actions" style={{ marginTop: 24 }}>
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Department'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* EMPLOYEE ROSTER MODAL */}
            {modal === 'view' && activeDept && (
                <Modal title={`${activeDept.name} — Employee Roster`} onClose={closeModal} size="lg">
                    {loadingEmps ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading roster...</div>
                    ) : deptEmployees?.length > 0 ? (
                        <div style={{ margin: '-10px -20px -20px -20px' }}> {/* Counteract Modal padding for full-width table */}
                            <DataTable columns={empCols} data={deptEmployees} searchable emptyText="" />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            No active employees currently assigned to this department.
                        </div>
                    )}
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete this department? All employees in this department will be unassigned." onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
