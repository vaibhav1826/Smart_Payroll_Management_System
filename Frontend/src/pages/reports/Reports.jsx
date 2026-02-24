import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { exportCSV, exportExcel } from '../../utils/exportUtils';
import { formatDate, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Reports() {
    const [reportType, setReportType] = useState('payroll');
    const [params, setParams] = useState({});

    const endpointMap = { payroll: '/payroll', attendance: '/attendance', leaves: '/leaves', employees: '/employees' };
    const { data, loading } = useFetch(endpointMap[reportType], params);

    const rows = data?.[reportType] || data?.attendance || data?.employees || [];

    const flattenRows = () => rows.map(r => {
        if (reportType === 'payroll') return { Employee: r.employee?.name, Month: r.month, Year: r.year, Gross: r.grossPay, Deductions: r.deductions, Net: r.netPay, Status: r.status };
        if (reportType === 'attendance') return { Employee: r.employee?.name, Date: formatDate(r.date), Status: r.status, CheckIn: r.checkIn, CheckOut: r.checkOut, Overtime: r.overtime };
        if (reportType === 'leaves') return { Employee: r.employee?.name, Type: r.type, From: formatDate(r.startDate), To: formatDate(r.endDate), Days: r.days, Status: r.status };
        if (reportType === 'employees') return { Name: r.name, Email: r.email, Dept: r.department, Designation: r.designation, Salary: r.salary, Status: r.status };
        return r;
    });

    const handleExportCSV = () => { exportCSV(flattenRows(), `${reportType}_report.csv`); toast.success('CSV downloaded.'); };
    const handleExportExcel = () => { exportExcel(flattenRows(), `${reportType}_report.xlsx`); toast.success('Excel downloaded.'); };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 Reports</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" onClick={handleExportCSV} disabled={!rows.length}>⬇️ CSV</button>
                    <button className="btn btn-success" onClick={handleExportExcel} disabled={!rows.length}>⬇️ Excel</button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Report Type</label>
                        <select className="form-input" style={{ width: 160 }} value={reportType} onChange={e => { setReportType(e.target.value); setParams({}); }}>
                            {['payroll', 'attendance', 'leaves', 'employees'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                    </div>
                    {(reportType === 'payroll' || reportType === 'attendance') && (
                        <div className="form-field">
                            <label className="form-label">Month</label>
                            <select className="form-input" style={{ width: 140 }} value={params.month || ''} onChange={e => setParams(p => ({ ...p, month: e.target.value || undefined }))}>
                                <option value="">All</option>
                                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}</option>)}
                            </select>
                        </div>
                    )}
                    {(reportType === 'payroll' || reportType === 'attendance') && (
                        <div className="form-field">
                            <label className="form-label">Year</label>
                            <select className="form-input" style={{ width: 100 }} value={params.year || ''} onChange={e => setParams(p => ({ ...p, year: e.target.value || undefined }))}>
                                <option value="">All</option>
                                {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                {loading ? <LoadingSpinner /> : (
                    <div className="table-scroll">
                        <table className="datatable">
                            <thead>
                                <tr>{flattenRows()[0] && Object.keys(flattenRows()[0]).map(k => <th key={k}>{k}</th>)}</tr>
                            </thead>
                            <tbody>
                                {flattenRows().length === 0
                                    ? <tr><td colSpan={10} className="empty-row">No data found.</td></tr>
                                    : flattenRows().map((row, i) => (
                                        <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{v ?? '—'}</td>)}</tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )}
                <p className="text-muted text-sm" style={{ marginTop: 12 }}>{rows.length} records</p>
            </div>
        </div>
    );
}
