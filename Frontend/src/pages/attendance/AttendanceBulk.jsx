import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const STATUSES = ['present', 'absent', 'halfDay', 'leave'];
const today = new Date();

export default function AttendanceBulk() {
    const { data: empData } = useFetch('/employees');
    const employees = empData?.employees || [];
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [grid, setGrid] = useState({}); // { empId_dateStr: status }
    const [saving, setSaving] = useState(false);

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const key = (empId, day) => `${empId}_${day}`;
    const status = (empId, day) => grid[key(empId, day)] || '';

    const setStatus = (empId, day, val) => setGrid(p => ({ ...p, [key(empId, day)]: val }));

    const onSubmit = async () => {
        setSaving(true);
        try {
            const entries = [];
            for (const [k, s] of Object.entries(grid)) {
                if (!s) continue; // skip unset (—) cells
                // ObjectId has no underscores; day is the last segment
                const lastUnderscore = k.lastIndexOf('_');
                const empId = k.substring(0, lastUnderscore);
                const day = k.substring(lastUnderscore + 1);
                const date = new Date(year, month - 1, Number(day)).toISOString();
                entries.push({ employee: empId, date, status: s });
            }
            if (!entries.length) {
                toast.error('No attendance marked. Please select a status for at least one cell.');
                return;
            }
            await api.post('/attendance/bulk', { entries });
            toast.success(`${entries.length} attendance record(s) saved successfully!`);
            setGrid({});
        } catch (err) {
            toast.error(err.message || 'Failed to save attendance. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 8, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', borderRadius: 8 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                    <h1 className="page-title" style={{ marginBottom: 4 }}>Bulk Attendance Entry</h1>
                    <p className="page-subtitle" style={{ margin: 0, color: 'var(--text-muted)' }}>Rapidly mark monthly attendance for the entire workforce</p>
                </div>
                <button className="btn btn-primary" onClick={onSubmit} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    {saving ? 'Saving…' : 'Save All Records'}
                </button>
            </div>
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Select Attendance Period</h3>
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
                            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="datatable">
                        <thead>
                            <tr>
                                <th style={{ minWidth: 160 }}>Employee</th>
                                {days.map(d => <th key={d} style={{ minWidth: 44, textAlign: 'center', fontSize: 11 }}>{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp._id}>
                                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{emp.name}</td>
                                    {days.map(d => (
                                        <td key={d} style={{ padding: '4px 2px', textAlign: 'center' }}>
                                            <select
                                                className="form-input"
                                                style={{ padding: '2px 4px', fontSize: '11px', width: 40, minWidth: 40, textAlign: 'center' }}
                                                value={status(emp._id, d)}
                                                onChange={e => setStatus(emp._id, d, e.target.value)}
                                                title={STATUSES.map(s => s[0].toUpperCase()).join(' P=Present A=Absent H=Half L=Leave')}
                                            >
                                                <option value="">—</option>
                                                <option value="present">P</option>
                                                <option value="absent">A</option>
                                                <option value="halfDay">½</option>
                                                <option value="leave">L</option>
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-muted text-sm" style={{ marginTop: 12 }}>P = Present, A = Absent, ½ = Half Day, L = Leave</p>
            </div>
        </div>
    );
}
