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
    name: '', email: '', phone: '', department: '', designation: '',
    salary: '', joiningDate: '', status: 'active', shiftType: '8hr',
    supervisor: '', industry: '', contractor: '',
    esicNo: '', pfNo: '', uanNo: '', aadhaarNo: '', panNo: '',
};

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
    const [tab, setTab] = useState('basic'); // 'basic' | 'compliance' | 'bank'

    const openCreate = () => { setForm(EMPTY); setEditing(null); setTab('basic'); setModal('form'); };
    const openEdit = (row) => {
        setForm({
            ...row,
            supervisor: row.supervisor?._id || row.supervisor || '',
            industry: row.industry?._id || row.industry || '',
            contractor: row.contractor?._id || row.contractor || '',
            joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : '',
            esicNo: row.esicNo || '',
            pfNo: row.pfNo || '',
            uanNo: row.uanNo || '',
            aadhaarNo: row.aadhaarNo || '',
            panNo: row.panNo || '',
            shiftType: row.shiftType || '8hr',
        });
        setEditing(row._id); setTab('basic'); setModal('form');
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
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
        { key: 'designation', label: 'Designation' },
        { key: 'esicNo', label: 'ESIC No', render: r => r.esicNo || '—' },
        { key: 'pfNo', label: 'PF No', render: r => r.pfNo || '—' },
        { key: 'salary', label: 'Salary', render: r => formatCurrency(r.salary) },
        { key: 'joiningDate', label: 'Joined', render: r => formatDate(r.joiningDate) },
        { key: 'shiftType', label: 'Shift', render: r => <span className="badge badge-blue">{r.shiftType || '8hr'}</span> },
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
        background: 'none', border: 'none', borderBottom: active ? '2px solid var(--red)' : '2px solid transparent',
        cursor: 'pointer', fontSize: 13, transition: 'all 0.2s',
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><circle cx="12" cy="7" r="5" /><path d="M3 21v-2a9 9 0 0118 0v2" /></svg>
                        Employees
                    </h1>
                    <p className="page-subtitle">Manage workforce with full PF/ESIC details</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Employee</button>
            </div>
            <div className="card">
                <DataTable columns={cols} data={employees} loading={loading} searchable emptyText="No employees yet." />
            </div>

            {modal === 'form' && (
                <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={closeModal} size="lg">
                    {/* Tab bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                        {[['basic', 'Basic Info'], ['compliance', 'PF / ESIC'], ['bank', 'Bank Details']].map(([key, label]) => (
                            <button key={key} style={TAB_STYLE(tab === key)} onClick={() => setTab(key)}>{label}</button>
                        ))}
                    </div>

                    <form onSubmit={onSave}>
                        {tab === 'basic' && (
                            <div className="form-grid">
                                <FormField label="Full Name" name="name" value={form.name} onChange={onChange} required />
                                <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                                <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} />
                                <FormField label="Department" name="department" value={form.department} onChange={onChange} />
                                <FormField label="Designation" name="designation" value={form.designation} onChange={onChange} />
                                <FormField label="Salary (₹)" name="salary" type="number" value={form.salary} onChange={onChange} />
                                <FormField label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={onChange} />
                                <FormField label="Shift Type" name="shiftType" type="select" value={form.shiftType} onChange={onChange}
                                    options={[{ value: '8hr', label: '8 Hour' }, { value: '12hr', label: '12 Hour' }, { value: 'custom', label: 'Custom' }]} />
                                <FormField label="Status" name="status" type="select" value={form.status} onChange={onChange}
                                    options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                                <FormField label="Industry" name="industry" type="select" value={form.industry} onChange={onChange}
                                    options={industries.map(i => ({ value: i._id, label: i.name }))} />
                                <FormField label="Contractor" name="contractor" type="select" value={form.contractor} onChange={onChange}
                                    options={contractors.map(c => ({ value: c._id, label: c.name }))} />
                                <FormField label="Supervisor" name="supervisor" type="select" value={form.supervisor} onChange={onChange}
                                    options={supervisors.map(s => ({ value: s._id, label: s.user?.name || s._id }))} />
                            </div>
                        )}

                        {tab === 'compliance' && (
                            <div className="form-grid">
                                <FormField label="ESIC No" name="esicNo" value={form.esicNo} onChange={onChange} placeholder="e.g. 31-01-123456-000-0001" />
                                <FormField label="PF No" name="pfNo" value={form.pfNo} onChange={onChange} placeholder="e.g. MH/BAN/0012345/000/0000001" />
                                <FormField label="UAN No" name="uanNo" value={form.uanNo} onChange={onChange} placeholder="e.g. 100123456789" />
                                <FormField label="Aadhaar No" name="aadhaarNo" value={form.aadhaarNo} onChange={onChange} placeholder="XXXX XXXX XXXX" />
                                <FormField label="PAN No" name="panNo" value={form.panNo} onChange={onChange} placeholder="e.g. ABCDE1234F" />
                            </div>
                        )}

                        {tab === 'bank' && (
                            <div className="form-grid">
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
