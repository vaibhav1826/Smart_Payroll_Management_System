import React from 'react';

export default function StatCard({ label, value, color = 'blue', trend }) {
    return (
        <div className={`stat-card stat-${color}`}>
            <div className="stat-body">
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value ?? '—'}</p>
                {trend != null && (
                    <p className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
                        {trend >= 0 ? '+' : ''}{trend}% from last month
                    </p>
                )}
            </div>
        </div>
    );
}
