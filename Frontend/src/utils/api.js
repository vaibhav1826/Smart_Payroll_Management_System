const BASE = '/api';

async function request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (!options.isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchOptions = {
        credentials: 'include',
        headers,
        ...options,
    };
    delete fetchOptions.isFormData;

    const res = await fetch(`${BASE}${path}`, fetchOptions);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
    return data;
}

export const api = {
    get: (path, params) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return request(`${path}${qs}`);
    },
    post: (path, body, isFormData = false) => request(path, { method: 'POST', body: isFormData ? body : JSON.stringify(body), isFormData }),
    put: (path, body, isFormData = false) => request(path, { method: 'PUT', body: isFormData ? body : JSON.stringify(body), isFormData }),
    delete: (path) => request(path, { method: 'DELETE' }),
};
