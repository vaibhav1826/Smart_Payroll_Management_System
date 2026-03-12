import React from 'react';

const COLORS = {
    active: 'badge-green',
    inactive: 'badge-red',
    present: 'badge-green',
    absent: 'badge-red',
    halfDay: 'badge-yellow',
    leave: 'badge-blue',
    pending: 'badge-yellow',
    approved: 'badge-green',
    rejected: 'badge-red',
    draft: 'badge-gray',
    generated: 'badge-blue',
    locked: 'badge-purple',
    admin: 'badge-purple',
    supervisor: 'badge-blue',
    employee: 'badge-green',
    contractor: 'badge-yellow',
};

export default function StatusBadge({ value }) {
    if (!value) return <span className="badge badge-gray">—</span>;
    const cls = COLORS[value] || 'badge-gray';
    return <span className={`badge ${cls}`}>{value}</span>;
}
