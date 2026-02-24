import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export function useFetch(path, params, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch_ = useCallback(async () => {
        if (!path) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(path, params);
            setData(res);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, JSON.stringify(params), ...deps]);

    useEffect(() => { fetch_(); }, [fetch_]);

    return { data, loading, error, refresh: fetch_ };
}
