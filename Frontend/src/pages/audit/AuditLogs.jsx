import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';

export default function AuditLogs() {
    const [params, setParams] = useState({ limit: 50 });
    const { data, loading } = useFetch('/audit-logs', params);
    const logs = data?.logs || [];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🔍 Audit Logs</h1>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="form-field">
                        <label className="form-label">Module</label>
                        <select className="form-input" style={{ width: 160 }} value={params.module || ''} onChange={e => setParams(p => ({ ...p, module: e.target.value || undefined }))}>
                            <option value="">All modules</option>
                            {['auth', 'employee', 'supervisor', 'attendance', 'leave', 'payroll', 'notification'].map(m => (
                                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Action</label>
                        <select className="form-input" style={{ width: 140 }} value={params.action || ''} onChange={e => setParams(p => ({ ...p, action: e.target.value || undefined }))}>
                            <option value="">All actions</option>
                            {['REGISTER', 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'GENERATE', 'LOCK'].map(a => <option key={a}>{a}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setParams({ limit: 50 })}>Clear</button>
                </div>
            </div>

            <div className="card">
                <div className="table-scroll">
                    <table className="datatable">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Module</th>
                                <th>Details</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? <tr><td colSpan={6} className="empty-row">Loading…</td></tr>
                                : logs.length === 0
                                    ? <tr><td colSpan={6} className="empty-row">No audit logs found.</td></tr>
                                    : logs.map((log, i) => (
                                        <tr key={log._id || i}>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{formatDateTime(log.timestamp || log.createdAt)}</td>
                                            <td>{log.userName || log.user || '—'}</td>
                                            <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{log.action}</span></td>
                                            <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{log.module}</span></td>
                                            <td style={{ maxWidth: 260, fontSize: 12, color: 'var(--text-secondary)' }}>{log.details || '—'}</td>
                                            <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.ip || '—'}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
