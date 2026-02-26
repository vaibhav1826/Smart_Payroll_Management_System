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

const EMPTY = {
    name: '', email: '', phone: '', bloodGroup: '', dob: '', gender: '',
    employmentType: '', branch: '', location: '', joiningDate: '', designation: '', department: '',
    manager: '', supervisor: '',
    permanentAddress: '', currentAddress: '',
    aadhaarCard: '', panCard: '',
    bankDetails: { bankName: '', accountNumber: '', ifscCode: '' },
    salary: '', status: 'active'
};

export default function EmployeeList() {
    const { data, loading, refresh } = useFetch('/employees');
    // For dropdowns, assuming we fetch users to assign managers/supervisors
    // In a real app we'd fetch /users?role=manager and ?role=supervisor
    const employees = data?.employees || [];

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('personal'); // 'personal' | 'company' | 'address' | 'document'

    const openCreate = () => { setForm(EMPTY); setEditing(null); setTab('personal'); setModal('form'); };
    const openEdit = (row) => {
        setForm({
            ...row,
            dob: row.dob ? row.dob.slice(0, 10) : '',
            joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : '',
            manager: row.manager?._id || row.manager || '',
            supervisor: row.supervisor?._id || row.supervisor || '',
            bankDetails: row.bankDetails || { bankName: '', accountNumber: '', ifscCode: '' }
        });
        setEditing(row._id); setTab('personal'); setModal('form');
    };
    const closeModal = () => { setModal(null); setEditing(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, salary: Number(form.salary) || 0 };

            if (editing) { await api.put(`/employees/${editing}`, payload); toast.success('Employee updated.'); }
            else { await api.post('/employees', payload); toast.success('Employee added.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/employees/${deleting}`); toast.success('Employee removed.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        {
            key: 'name',
            label: 'Employee Name',
            render: r => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 16 }}>👤</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 500 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.email}</div>
                    </div>
                </div>
            )
        },
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

    const TAB_STYLE = active => ({
        padding: '8px 16px', borderBottom: active ? '2px solid var(--red)' : '2px solid transparent',
        fontWeight: active ? 600 : 400, color: active ? 'var(--red)' : 'var(--text-muted)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s',
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="7" r="5" /><path d="M3 21v-2a9 9 0 0118 0v2" /></svg>
                        Employee Core Management
                    </h1>
                    <p className="page-subtitle">Manage personal, company, address, and document details</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Employee</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={employees} loading={loading} searchable emptyText="No employees found." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={closeModal} size="lg">
                    {/* Tab bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                        {[['personal', 'Personal Details'], ['company', 'Company Details'], ['address', 'Address'], ['document', 'Documents']].map(([key, label]) => (
                            <button key={key} type="button" style={TAB_STYLE(tab === key)} onClick={() => setTab(key)}>{label}</button>
                        ))}
                    </div>

                    <form onSubmit={onSave}>
                        {tab === 'personal' && (
                            <div className="form-grid">
                                <FormField label="Full Name" name="name" value={form.name} onChange={onChange} required />
                                <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                                <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} />
                                <FormField label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={onChange} placeholder="e.g. O+" />
                                <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={onChange} />
                                <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={onChange}
                                    options={[{ value: '', label: 'Select' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
                            </div>
                        )}

                        {tab === 'company' && (
                            <div className="form-grid">
                                <FormField label="Employment Type" name="employmentType" value={form.employmentType} onChange={onChange} placeholder="Full-Time, Contract..." />
                                <FormField label="Branch" name="branch" value={form.branch} onChange={onChange} />
                                <FormField label="Location" name="location" value={form.location} onChange={onChange} />
                                <FormField label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={onChange} />
                                <FormField label="Designation" name="designation" value={form.designation} onChange={onChange} />
                                <FormField label="Department" name="department" value={form.department} onChange={onChange} />
                                <FormField label="Assign Manager" name="manager" type="select" value={form.manager} onChange={onChange}
                                    options={[{ value: '', label: 'None' }, ...employees.map(e => ({ value: e._id, label: e.name }))]} />
                                <FormField label="Assign Supervisor" name="supervisor" type="select" value={form.supervisor} onChange={onChange}
                                    options={[{ value: '', label: 'None' }, ...employees.map(e => ({ value: e._id, label: e.name }))]} />
                                <FormField label="Salary (₹)" name="salary" type="number" value={form.salary} onChange={onChange} />
                                <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                    options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                            </div>
                        )}

                        {tab === 'address' && (
                            <div className="form-grid">
                                <FormField label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={onChange} />
                                <FormField label="Current Address" name="currentAddress" value={form.currentAddress} onChange={onChange} />
                            </div>
                        )}

                        {tab === 'document' && (
                            <div className="form-grid">
                                <FormField label="Aadhaar Card No" name="aadhaarCard" value={form.aadhaarCard} onChange={onChange} placeholder="XXXX XXXX XXXX" />
                                <FormField label="PAN Card No" name="panCard" value={form.panCard} onChange={onChange} placeholder="ABCDE1234F" />
                                <FormField label="Bank Name" name="bankDetails.bankName" value={form.bankDetails?.bankName || ''} onChange={e => setForm(p => ({ ...p, bankDetails: { ...p.bankDetails, bankName: e.target.value } }))} />
                                <FormField label="Account Number" name="bankDetails.accountNumber" value={form.bankDetails?.accountNumber || ''} onChange={e => setForm(p => ({ ...p, bankDetails: { ...p.bankDetails, accountNumber: e.target.value } }))} />
                                <FormField label="IFSC Code" name="bankDetails.ifscCode" value={form.bankDetails?.ifscCode || ''} onChange={e => setForm(p => ({ ...p, bankDetails: { ...p.bankDetails, ifscCode: e.target.value } }))} />
                            </div>
                        )}

                        <div className="form-actions" style={{ marginTop: 20 }}>
                            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {deleting && <ConfirmDialog message="Delete this employee permanently?" onConfirm={onDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </div>
    );
}
