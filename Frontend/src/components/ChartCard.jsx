import React from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from 'recharts';

// Professional palette aligned with red/gray theme
const PALETTE = ['#CC0000', '#1D4ED8', '#16A34A', '#B45309', '#6D28D9', '#0E7490'];

const TOOLTIP_STYLE = {
    background: '#FFFFFF',
    border: '1px solid #DDE1E7',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontSize: '12px',
    color: '#111827'
};
const AXIS_TICK = { fill: '#6B7280', fontSize: 11 };
const GRID_STROKE = '#EEF0F3';

export default function ChartCard({ title, type = 'bar', data = [], dataKeys = [], xKey = 'name' }) {
    return (
        <div className="chart-card">
            <h4 className="chart-title">{title}</h4>
            <ResponsiveContainer width="100%" height={240}>
                {type === 'pie' ? (
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={dataKeys[0] || 'value'}
                            nameKey={xKey}
                            cx="50%" cy="50%"
                            outerRadius={85}
                            innerRadius={40}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 12, color: '#374151' }}
                        />
                    </PieChart>
                ) : type === 'line' ? (
                    <LineChart data={data} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {dataKeys.map((k, i) => (
                            <Line
                                key={k} type="monotone" dataKey={k}
                                stroke={PALETTE[i]} strokeWidth={2}
                                dot={{ r: 3, fill: PALETTE[i] }} activeDot={{ r: 5 }}
                            />
                        ))}
                    </LineChart>
                ) : (
                    <BarChart data={data} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(204,0,0,0.04)' }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {dataKeys.map((k, i) => (
                            <Bar key={k} dataKey={k} fill={PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={40} />
                        ))}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
