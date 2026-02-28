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
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    fontSize: '13px',
    color: '#111827',
    padding: '12px 16px'
};
const AXIS_TICK = { fill: '#6B7280', fontSize: 11, fontWeight: 500 };
const GRID_STROKE = '#F3F4F6';

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
                            outerRadius={75}
                            innerRadius={45}
                            paddingAngle={3}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelStyle={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                            labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
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
                        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: GRID_STROKE, strokeWidth: 1 }} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
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
                        <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                        {dataKeys.map((k, i) => (
                            <Bar key={k} dataKey={k} fill={PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={40} />
                        ))}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
