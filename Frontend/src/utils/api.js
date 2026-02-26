const BASE = '/api';

async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    const res = await fetch(`${BASE}${path}`, {
        credentials: 'include',
        headers,
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
    return data;
}

export const api = {
    get: (path, params) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return request(`${path}${qs}`);
    },
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
};
