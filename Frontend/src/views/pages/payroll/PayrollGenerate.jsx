import React, { useState, useRef, useEffect } from 'react';
import { useFetch } from '../../../controllers/hooks/useFetch';
import { api } from '../../../models/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../../utils/formatters';
import { exportExcel, exportSalarySlipPDF } from '../../../utils/exportUtils';
import toast from 'react-hot-toast';

const cur = new Date();

export default function PayrollGenerate() {
    const [periodType, setPeriodType] = useState('monthly');
    const [month, setMonth] = useState(cur.getMonth() + 1);
    const [year, setYear] = useState(cur.getFullYear());
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);

    const { data: empData, refetch: refetchEmployees } = useFetch('/employees', { status: 'active' });

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeCount = empData?.employees?.length || 0;

    const filteredEmployees = empData?.employees?.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    const selectedEmployeeObj = empData?.employees?.find(e => e._id === selectedEmployee);

    const onGenerate = async () => {
        setGenerating(true); setResult(null);
        try {
            const payload = { year, month: periodType === 'yearly' ? 'all' : month };
            if (selectedEmployee !== 'all') payload.employeeId = selectedEmployee;

            const data = await api.post('/payroll/generate', payload);
            setResult(data);
            toast.success(`${periodType === 'yearly' ? 'Yearly' : 'Monthly'} Payroll generated for ${data.count} employees.`);
        } catch (err) { toast.error(err.message); }
        finally { setGenerating(false); }
    };

    const onSettleExit = async () => {
        if (selectedEmployee === 'all' || !selectedEmployeeObj) return;
        const confirmExit = window.confirm(`Are you sure you want to process the final settlement for ${selectedEmployeeObj.name}? This will mark them as inactive and calculate their salary strictly up to today.`);
        if (!confirmExit) return;

        setGenerating(true); setResult(null);
        try {
            // 1. Mark as inactive and set exitDate to today
            await api.put(`/employees/${selectedEmployee}`, {
                status: 'inactive',
                exitDate: new Date()
            });

            // 2. Clear out the search dropdown 
            setSearchTerm('');
            setSelectedEmployee('all');

            // 3. Immediately generate this month's prorated settlement slip for the newly exited user
            const payload = { year, month: cur.getMonth() + 1, employeeId: selectedEmployeeObj._id };
            const data = await api.post('/payroll/generate', payload);

            setResult(data);
            refetchEmployees(); // Refresh the list so they vanish from the active dropdown
            toast.success(`Final Settlement process complete. ${selectedEmployeeObj.name} is now inactive.`);
        } catch (err) {
            toast.error(err.message || 'Failed to process settlement.');
        } finally {
            setGenerating(false);
        }
    };

    const handleBankExport = () => {
        if (!result || !result.payrolls || result.payrolls.length === 0) {
            return toast.error("No payrolls generated to export.");
        }

        const reportData = result.payrolls.map(p => ({
            'Employee Name': p.employee?.name || '—',
            'Department': p.employee?.department || '—',
            'Bank Name': p.employee?.bankDetails?.bankName || '—',
            'Account Number': p.employee?.bankDetails?.accountNumber || '—',
            'IFSC Code': p.employee?.bankDetails?.ifscCode || '—',
            'Net Pay (₹)': p.netPay || 0,
            'Remarks': `Salary for ${result.isYearly ? 'Year ' + year : month + '/' + year}`
        }));

        exportExcel(reportData, `Bank_Statement_${result.isYearly ? year : month + '_' + year}.xlsx`, 'Bank Report');
        toast.success('Bank statement generated!');
    };

    const handleSalarySheetExport = () => {
        if (!result || !result.payrolls || result.payrolls.length === 0) {
            return toast.error("No payrolls generated to export.");
        }

        const reportData = result.payrolls.map(p => ({
            'Emp ID': p.employee?._id || '—',
            'Employee Name': p.employee?.name || '—',
            'Department': p.employee?.department || '—',
            'Present Days': p.presentDays || 0,
            'Basic (₹)': p.basicSalary || 0,
            'HRA (₹)': p.hra || 0,
            'DA (₹)': p.da || 0,
            'Bonus (₹)': p.regularBonuses || 0,
            'Gross Pay (₹)': p.grossPay || 0,
            'PF (₹)': p.pf || 0,
            'ESI (₹)': p.esi || 0,
            'TDS (₹)': p.tds || 0,
            'Tot. Deductions (₹)': p.totalDeductions || 0,
            'Net Pay (₹)': p.netPay || 0,
            'Bank Name': p.employee?.bankDetails?.bankName || '—',
            'Account Number': p.employee?.bankDetails?.accountNumber || '—',
            'IFSC Code': p.employee?.bankDetails?.ifscCode || '—'
        }));

        exportExcel(reportData, `Salary_Sheet_${result.isYearly ? year : month + '_' + year}.xlsx`, 'Salary Sheet');
        toast.success('Complete Salary Sheet exported!');
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 8, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', borderRadius: 8 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h1 className="page-title">Salary Management</h1>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <StatCard label="Active Employees" value={activeCount} icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} color="blue" />
                <StatCard label="Selected Period" value={result?.isYearly ? `Year ${year}` : `${new Date(year, month - 1, 1).toLocaleString('en', { month: 'long' })} ${year}`} icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} color="purple" />
                {result && <StatCard label="Generated" value={result.count} icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="green" />}
                {result && <StatCard label="Total Net Pay" value={formatCurrency(result.payrolls?.reduce((s, p) => s + (Number(p.netPay) || 0), 0))} icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="yellow" />}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 16 }}>Select Pay Period</h3>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Period Type</label>
                        <select className="form-input" style={{ width: 140 }} value={periodType} onChange={e => { setPeriodType(e.target.value); setResult(null); }}>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly Aggregate</option>
                        </select>
                    </div>

                    {periodType === 'monthly' && (
                        <div className="form-field">
                            <label className="form-label">Month</label>
                            <select className="form-input" style={{ width: 160 }} value={month} onChange={e => setMonth(Number(e.target.value))}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-field">
                        <label className="form-label">Year</label>
                        <select className="form-input" style={{ width: 110 }} value={year} onChange={e => setYear(Number(e.target.value))}>
                            {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="form-field" style={{ position: 'relative' }} ref={searchRef}>
                        <label className="form-label">Employee</label>
                        <div
                            className="form-input"
                            style={{ width: 240, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {selectedEmployee === 'all' ? 'All Employees' : selectedEmployeeObj?.name || 'Select Employee'}
                            </span>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                        {searchOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, width: 240, marginTop: 4,
                                background: 'white', border: '1px solid var(--border)',
                                borderRadius: 6, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                maxHeight: 250, overflowY: 'auto'
                            }}>
                                <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ width: '100%', padding: '6px 12px' }}
                                        autoFocus
                                    />
                                </div>
                                <div
                                    style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedEmployee === 'all' ? 'rgba(29,78,216,0.1)' : 'transparent' }}
                                    onClick={() => { setSelectedEmployee('all'); setSearchOpen(false); setSearchTerm(''); }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                    onMouseOut={e => e.currentTarget.style.background = selectedEmployee === 'all' ? 'rgba(29,78,216,0.1)' : 'transparent'}
                                >
                                    <strong>All Employees</strong>
                                </div>
                                {filteredEmployees.map(emp => (
                                    <div
                                        key={emp._id}
                                        style={{
                                            padding: '8px 12px', cursor: 'pointer',
                                            background: selectedEmployee === emp._id ? 'rgba(29,78,216,0.1)' : 'transparent'
                                        }}
                                        onClick={() => { setSelectedEmployee(emp._id); setSearchOpen(false); setSearchTerm(''); }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                        onMouseOut={e => e.currentTarget.style.background = selectedEmployee === emp._id ? 'rgba(29,78,216,0.1)' : 'transparent'}
                                    >
                                        <div style={{ fontWeight: 500 }}>{emp.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department || 'N/A'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={onGenerate} disabled={generating} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {generating ? <LoadingSpinner /> : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            {generating ? 'Generating…' : 'Generate Payroll'}
                        </button>

                        {periodType === 'monthly' && selectedEmployee !== 'all' && (
                            <button
                                className="btn btn-danger"
                                onClick={onSettleExit}
                                disabled={generating}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--danger)', color: 'white' }}
                            >
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Process Exit & Settle
                            </button>
                        )}
                    </div>
                </div>

                {result && (
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3>{result.isYearly ? `Yearly Aggregated Payroll (${year})` : 'Generated Payrolls'}</h3>
                            {(!selectedEmployee || selectedEmployee === 'all' || result.payrolls?.length > 1) && (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', fontSize: 13, gap: 6 }} onClick={handleSalarySheetExport}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Download Salary Sheet
                                    </button>
                                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', fontSize: 13, gap: 6 }} onClick={handleBankExport}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                        Bank File (NEFT)
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="table-scroll">
                            <table className="datatable">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Days Present</th>
                                        <th>Gross Pay</th>
                                        <th>Deductions</th>
                                        <th>Net Pay</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.payrolls?.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{p.employee?.name || '—'}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.employee?.department || '—'}</div>
                                            </td>
                                            <td>{p.presentDays}</td>
                                            <td>{formatCurrency(p.grossPay)}</td>
                                            <td style={{ color: 'var(--danger)' }}>{formatCurrency(p.totalDeductions)}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(p.netPay)}</td>
                                            <td><span className={result.isYearly ? "badge badge-purple" : "badge badge-blue"}>{p.status}</span></td>
                                            <td>
                                                {!result.isYearly && (
                                                    <button className="btn btn-sm btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => exportSalarySlipPDF(p)}>
                                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                        PDF
                                                    </button>
                                                )}
                                                {result.isYearly && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Consolidated</span>}
                                            </td>
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
