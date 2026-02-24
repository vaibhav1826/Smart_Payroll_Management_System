import React, { useState, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function DataTable({ columns, data, loading, emptyText = 'No records found.', searchable = false, actions }) {
    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const PER_PAGE = 15;

    const sorted = useMemo(() => {
        let rows = [...(data || [])];
        if (search && searchable) {
            const q = search.toLowerCase();
            rows = rows.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q)));
        }
        if (sortCol) {
            rows.sort((a, b) => {
                const av = a[sortCol] ?? ''; const bv = b[sortCol] ?? '';
                return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
            });
        }
        return rows;
    }, [data, search, sortCol, sortAsc, searchable]);

    const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const displayed = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSort = (key) => {
        if (sortCol === key) setSortAsc(p => !p);
        else { setSortCol(key); setSortAsc(true); }
    };

    return (
        <div className="datatable-wrapper">
            {(searchable || actions) && (
                <div className="datatable-toolbar">
                    {searchable && (
                        <input className="datatable-search" placeholder="Search..." value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    )}
                    {actions && <div className="datatable-actions">{actions}</div>}
                </div>
            )}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="table-scroll">
                        <table className="datatable">
                            <thead>
                                <tr>
                                    {columns.map(col => (
                                        <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)}
                                            className={col.sortable !== false ? 'sortable' : ''}>
                                            {col.label}
                                            {sortCol === col.key && <span>{sortAsc ? ' ↑' : ' ↓'}</span>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.length === 0
                                    ? <tr><td colSpan={columns.length} className="empty-row">{emptyText}</td></tr>
                                    : displayed.map((row, i) => (
                                        <tr key={row._id || i}>
                                            {columns.map(col => (
                                                <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? '—')}</td>
                                            ))}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {pages > 1 && (
                        <div className="datatable-pagination">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                            <span>Page {page} of {pages}</span>
                            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>›</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
