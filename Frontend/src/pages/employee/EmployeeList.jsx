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
    const { data: deptData } = useFetch('/departments');

    // For dropdowns, assuming we fetch users to assign managers/supervisors
    // In a real app we'd fetch /users?role=manager and ?role=supervisor
    const employees = data?.employees || [];
    const departments = deptData?.departments || [];

    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [photoFile, setPhotoFile] = useState(null);
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('personal'); // 'personal' | 'company' | 'address' | 'document'

    const openCreate = () => { setForm(EMPTY); setEditing(null); setTab('personal'); setPhotoFile(null); setAadhaarFile(null); setModal('form'); };
    const openEdit = (row) => {
        setForm({
            ...row,
            dob: row.dob ? row.dob.slice(0, 10) : '',
            joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : '',
            manager: row.manager?._id || row.manager || '',
            supervisor: row.supervisor?._id || row.supervisor || '',
            bankDetails: row.bankDetails || { bankName: '', accountNumber: '', ifscCode: '' },
            photo: row.photo || '',
            aadhaarPhoto: row.aadhaarPhoto || ''
        });
        setPhotoFile(null); setAadhaarFile(null);
        setEditing(row._id); setTab('personal'); setModal('form');
    };
    const closeModal = () => { setModal(null); setEditing(null); setPhotoFile(null); setAadhaarFile(null); };
    const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form, salary: Number(form.salary) || 0 };

            // Fix CastError for empty ObjectIds
            if (!payload.manager) payload.manager = null;
            if (!payload.supervisor) payload.supervisor = null;

            let submitData = payload;
            let isFormData = false;

            if (photoFile || aadhaarFile) {
                isFormData = true;
                submitData = new FormData();
                Object.keys(payload).forEach(key => {
                    if (key === 'photo' || key === 'aadhaarPhoto') return;
                    if (key === 'bankDetails') {
                        submitData.append(key, JSON.stringify(payload[key]));
                    } else if (payload[key] !== null && payload[key] !== undefined) {
                        submitData.append(key, payload[key]);
                    }
                });
                if (photoFile) submitData.append('photo', photoFile);
                if (aadhaarFile) submitData.append('aadhaarPhoto', aadhaarFile);
            }

            if (editing) { await api.put(`/employees/${editing}`, submitData, isFormData); toast.success('Employee updated.'); }
            else { await api.post('/employees', submitData, isFormData); toast.success('Employee added.'); }
            refresh(); closeModal();
        } catch (err) { toast.error(err.response?.data?.error || err.message); }
        finally { setSaving(false); }
    };

    const onDelete = async () => {
        setSaving(true);
        try { await api.delete(`/employees/${deleting}`); toast.success('Employee removed.'); refresh(); setDeleting(null); }
        catch (err) { toast.error(err.response?.data?.error || err.message); }
        finally { setSaving(false); }
    };

    const cols = [
        {
            key: 'name',
            label: 'Employee Name',
            render: r => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {r.photo ? (
                            <img src={r.photo} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        )}
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
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setDeleting(r._id)} style={{ color: 'var(--danger)', padding: '4px 8px' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 8, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', borderRadius: 8 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                    <h1 className="page-title" style={{ marginBottom: 4 }}>Employee Core Management</h1>
                    <p className="page-subtitle" style={{ margin: 0, color: 'var(--text-muted)' }}>Manage personal, company, address, and document details</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Employee
                </button>
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
                                <div className="form-field">
                                    <label className="form-label" style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                        Profile Photo
                                        {form.photo && !photoFile && <a href={form.photo} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--primary)', textDecoration: 'none' }}>View Current</a>}
                                    </label>
                                    <input type="file" className="form-input" accept="image/jpeg,image/png,image/jpg" onChange={e => setPhotoFile(e.target.files[0])} />
                                </div>
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
                                <FormField label="Department" name="department" type="select" value={form.department} onChange={onChange}
                                    options={[
                                        { value: '', label: 'Select Department' },
                                        ...departments.map(d => ({ value: d.name, label: d.name }))
                                    ]} />
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
                                <div className="form-field">
                                    <label className="form-label" style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                        Aadhaar Photo
                                        {form.aadhaarPhoto && !aadhaarFile && <a href={`/uploads/employees/${form.aadhaarPhoto}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--primary)', textDecoration: 'none' }}>View Current</a>}
                                    </label>
                                    <input type="file" className="form-input" accept="image/jpeg,image/png,image/jpg" onChange={e => setAadhaarFile(e.target.files[0])} />
                                </div>
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
