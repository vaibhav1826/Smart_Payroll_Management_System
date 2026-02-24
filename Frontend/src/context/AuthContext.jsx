import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

const INACTIVITY_MS = 30 * 60 * 1000;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showInactivityModal, setShowInactivityModal] = useState(false);
    const timerRef = useRef(null);

    const resetTimer = useCallback(() => {
        if (!user) return;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowInactivityModal(true), INACTIVITY_MS);
    }, [user]);

    useEffect(() => {
        api.get('/auth/me')
            .then(d => { if (d?.user) setUser(d.user); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;
        resetTimer();
        const events = ['mousemove', 'keydown', 'click', 'touchstart'];
        events.forEach(e => window.addEventListener(e, resetTimer));
        return () => {
            events.forEach(e => window.removeEventListener(e, resetTimer));
            clearTimeout(timerRef.current);
        };
    }, [user, resetTimer]);

    const login = async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        setUser(data.user);
        return data.user;
    };

    const register = async (payload) => {
        const data = await api.post('/auth/register', payload);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await api.post('/auth/logout', {}).catch(() => { });
        setUser(null);
        clearTimeout(timerRef.current);
    };

    const continueSession = async () => {
        try {
            const data = await api.post('/auth/refresh', {});
            if (data?.user) setUser(data.user);
        } catch { }
        setShowInactivityModal(false);
        resetTimer();
    };

    const forceLogout = async () => {
        await logout();
        setShowInactivityModal(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, showInactivityModal, continueSession, forceLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
