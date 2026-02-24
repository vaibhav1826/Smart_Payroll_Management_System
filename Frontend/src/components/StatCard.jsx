import React from 'react';

const COLOR_MAP = {
    blue: { bg: 'rgba(29,78,216,0.08)', accent: '#1D4ED8', icon_bg: 'rgba(29,78,216,0.12)' },
    red: { bg: 'rgba(204,0,0,0.06)', accent: '#CC0000', icon_bg: 'rgba(204,0,0,0.10)' },
    green: { bg: 'rgba(22,163,74,0.07)', accent: '#16A34A', icon_bg: 'rgba(22,163,74,0.12)' },
    yellow: { bg: 'rgba(180,83,9,0.07)', accent: '#B45309', icon_bg: 'rgba(180,83,9,0.12)' },
    purple: { bg: 'rgba(109,40,217,0.07)', accent: '#6D28D9', icon_bg: 'rgba(109,40,217,0.12)' },
    cyan: { bg: 'rgba(14,116,144,0.07)', accent: '#0E7490', icon_bg: 'rgba(14,116,144,0.12)' },
};

export default function StatCard({ label, value, icon, color = 'blue', subtitle }) {
    const c = COLOR_MAP[color] || COLOR_MAP.blue;

    return (
        <div className="stat-card" style={{ borderLeft: `3px solid ${c.accent}`, background: c.bg }}>
            <div className="stat-card-body">
                <div>
                    <div className="stat-card-label">{label}</div>
                    <div className="stat-card-value" style={{ color: c.accent }}>{value ?? '—'}</div>
                    {subtitle && <div className="stat-card-sub">{subtitle}</div>}
                </div>
                {icon && (
                    <div className="stat-card-icon" style={{ background: c.icon_bg, color: c.accent }}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
