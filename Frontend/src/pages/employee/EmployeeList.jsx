import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY = { name: '', email: '', phone: '', department: '', designation: '', salary: '', joiningDate: '', status: 'active', supervisor: '', industry: '', contractor: '' };

export default function EmployeeList() {
    const { data, loading, refresh } = useFetch('/employees');
    const { data: indData } = useFetch('/industries');
    const { data: conData } = useFetch('/contractors');
    const { data: supData } = useFetch('/supervisors');
    const employees = data?.employees || [];
    const industries = indData?.industries || [];
    const contractors = conData?.contractors || [];
    const supervisors = supData?.supervisors || [];

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('form'); };
    const openEdit = (row) => {
        setForm({
            ...row,
            supervisor: row.supervisor?._id || row.supervisor || '',
            industry: row.industry?._id || row.industry || '',
            contractor: row.contractor?._id || row.contractor || '',
            joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : '',
        });
        setEditing(row._id); setModal('form');
    };
    const closeModal = () => { setModal(null); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, salary: Number(form.salary) || 0 };
            if (editing) { await api.put(`/employees/${editing}`, payload); toast.success('Employee updated.'); }
            else { await api.post('/employees', payload); toast.success('Employee created.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/employees/${deleting}`); toast.success('Employee deleted.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
        { key: 'designation', label: 'Designation' },
        { key: 'salary', label: 'Salary', render: r => formatCurrency(r.salary) },
        { key: 'joiningDate', label: 'Joined', render: r => formatDate(r.joiningDate) },
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
                <h1 className="page-title">👥 Employees</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Employee</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={employees} loading={loading} searchable emptyText="No employees yet." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={closeModal} size="lg">
                    <form onSubmit={onSave}>
                        <div className="form-grid">
                            <FormField label="Full Name" name="name" value={form.name} onChange={onChange} required />
                            <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                            <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} />
                            <FormField label="Department" name="department" value={form.department} onChange={onChange} />
                            <FormField label="Designation" name="designation" value={form.designation} onChange={onChange} />
                            <FormField label="Salary (₹)" name="salary" type="number" value={form.salary} onChange={onChange} />
                            <FormField label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={onChange} />
                            <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                            <FormField label="Industry" name="industry" type="select" value={form.industry} onChange={onChange}
                                options={industries.map(i => ({ value: i._id, label: i.name }))} />
                            <FormField label="Contractor" name="contractor" type="select" value={form.contractor} onChange={onChange}
                                options={contractors.map(c => ({ value: c._id, label: c.name }))} />
                            <FormField label="Supervisor" name="supervisor" type="select" value={form.supervisor} onChange={onChange}
                                options={supervisors.map(s => ({ value: s._id, label: s.user?.name || s._id }))} />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete this employee?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
