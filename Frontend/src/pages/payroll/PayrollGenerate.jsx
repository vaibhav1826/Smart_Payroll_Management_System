import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const cur = new Date();

export default function PayrollGenerate() {
    const [month, setMonth] = useState(cur.getMonth() + 1);
    const [year, setYear] = useState(cur.getFullYear());
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState(null);

    const { data: empData } = useFetch('/employees', { status: 'active' });
    const activeCount = empData?.employees?.length || 0;

    const onGenerate = async () => {
        setGenerating(true); setResult(null);
        try {
            const data = await api.post('/payroll/generate', { month, year });
            setResult(data);
            toast.success(`Payroll generated for ${data.count} employees.`);
        } catch (err) { toast.error(err.message); }
        finally { setGenerating(false); }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💳 Generate Payroll</h1>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Active Employees" value={activeCount} icon="👥" color="blue" />
                <StatCard label="Selected Month" value={`${new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' })} ${year}`} icon="📅" color="purple" />
                {result && <StatCard label="Generated" value={result.count} icon="✅" color="green" />}
                {result && <StatCard label="Total Payroll" value={formatCurrency(result.payrolls?.reduce((s, p) => s + (p.netPay || 0), 0))} icon="💰" color="yellow" />}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 16 }}>Select Pay Period</h3>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Month</label>
                        <select className="form-input" style={{ width: 160 }} value={month} onChange={e => setMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Year</label>
                        <select className="form-input" style={{ width: 110 }} value={year} onChange={e => setYear(Number(e.target.value))}>
                            {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={onGenerate} disabled={generating} style={{ marginBottom: 1 }}>
                        {generating ? <><LoadingSpinner /> Generating…</> : '⚡ Generate Payroll'}
                    </button>
                </div>

                {result && (
                    <div style={{ marginTop: 24 }}>
                        <div className="table-scroll">
                            <table className="datatable">
                                <thead>
                                    <tr><th>Employee</th><th>Dept</th><th>Days Present</th><th>Gross Pay</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {result.payrolls?.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.employee?.name || '—'}</td>
                                            <td>{p.employee?.department || '—'}</td>
                                            <td>{p.presentDays}</td>
                                            <td>{formatCurrency(p.grossPay)}</td>
                                            <td>{formatCurrency(p.deductions)}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(p.netPay)}</td>
                                            <td><span className="badge badge-blue">{p.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
