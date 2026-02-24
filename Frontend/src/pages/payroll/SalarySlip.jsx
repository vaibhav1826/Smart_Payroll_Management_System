import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { exportSalarySlipPDF } from '../../utils/exportUtils';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SalarySlip() {
    const [params, setParams] = useState({});
    const { data, loading } = useFetch('/payroll', params);
    const payrolls = data?.payrolls || [];

    const [selected, setSelected] = useState(null);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🧾 Salary Slips</h1>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Month</label>
                        <select className="form-input" style={{ width: 150 }} value={params.month || ''} onChange={e => setParams(p => ({ ...p, month: e.target.value || undefined }))}>
                            <option value="">All months</option>
                            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Year</label>
                        <select className="form-input" style={{ width: 100 }} value={params.year || ''} onChange={e => setParams(p => ({ ...p, year: e.target.value || undefined }))}>
                            <option value="">All</option>
                            {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Slip list */}
            <div className="card" style={{ marginBottom: 20 }}>
                {loading ? <LoadingSpinner /> : (
                    <div className="table-scroll">
                        <table className="datatable">
                            <thead>
                                <tr><th>Employee</th><th>Period</th><th>Net Pay</th><th>Status</th><th></th></tr>
                            </thead>
                            <tbody>
                                {payrolls.length === 0
                                    ? <tr><td colSpan={5} className="empty-row">No salary slips found.</td></tr>
                                    : payrolls.map(p => (
                                        <tr key={p._id} className={selected?._id === p._id ? 'selected-row' : ''}>
                                            <td>{p.employee?.name || '—'}</td>
                                            <td>{formatMonthYear(p.month, p.year)}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(p.netPay)}</td>
                                            <td><StatusBadge value={p.status} /></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button className="btn btn-sm btn-ghost" onClick={() => setSelected(p)}>👁️ View</button>
                                                    <button className="btn btn-sm btn-primary" onClick={() => exportSalarySlipPDF(p)}>⬇️ PDF</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slip preview */}
            {selected && (
                <div className="card salary-slip-preview">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2>Salary Slip Preview</h2>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary" onClick={() => exportSalarySlipPDF(selected)}>⬇️ Download PDF</button>
                            <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕ Close</button>
                        </div>
                    </div>
                    <div className="slip-header">
                        <h1 style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>Shiv Enterprises</h1>
                        <p className="text-muted">Salary Slip — {formatMonthYear(selected.month, selected.year)}</p>
                    </div>
                    <div className="slip-employee-info">
                        <div><span className="text-muted">Employee:</span> {selected.employee?.name}</div>
                        <div><span className="text-muted">Designation:</span> {selected.employee?.designation || '—'}</div>
                        <div><span className="text-muted">Department:</span> {selected.employee?.department || '—'}</div>
                        <div><span className="text-muted">Working Days:</span> {selected.workingDays}</div>
                        <div><span className="text-muted">Present Days:</span> {selected.presentDays}</div>
                        <div><span className="text-muted">Leave Days:</span> {selected.leaveDays}</div>
                    </div>
                    <div className="slip-breakdown">
                        <div className="slip-col">
                            <h4>Earnings</h4>
                            <div className="slip-row"><span>Basic Salary</span><span>{formatCurrency(selected.basicSalary)}</span></div>
                            <div className="slip-row"><span>HRA</span><span>{formatCurrency(selected.hra)}</span></div>
                            <div className="slip-row"><span>DA</span><span>{formatCurrency(selected.da)}</span></div>
                            <div className="slip-row"><span>Other Allowances</span><span>{formatCurrency(selected.otherAllowances)}</span></div>
                            <div className="slip-row"><span>Overtime Pay</span><span>{formatCurrency(selected.overtimePay)}</span></div>
                            <div className="slip-row slip-total"><span>Gross Pay</span><span>{formatCurrency(selected.grossPay)}</span></div>
                        </div>
                        <div className="slip-col">
                            <h4>Deductions</h4>
                            <div className="slip-row"><span>PF</span><span>{formatCurrency(selected.pf)}</span></div>
                            <div className="slip-row slip-total"><span>Total Deductions</span><span>{formatCurrency(selected.deductions)}</span></div>
                        </div>
                    </div>
                    <div className="slip-net-pay">
                        <span>Net Pay</span>
                        <span style={{ color: 'var(--success)', fontSize: '1.4rem', fontWeight: 700 }}>{formatCurrency(selected.netPay)}</span>
                    </div>
                    <p className="text-muted text-sm" style={{ textAlign: 'center', marginTop: 12 }}>
                        This is a computer-generated payslip and does not require a signature.
                    </p>
                </div>
            )}
        </div>
    );
}
