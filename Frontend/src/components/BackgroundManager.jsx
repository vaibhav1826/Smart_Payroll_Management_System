import React from 'react';
import { useLocation } from 'react-router-dom';
import ThreeBackground from './ThreeBackground';

export default function BackgroundManager() {
    const location = useLocation();

    // Do not show on landing page
    if (location.pathname === '/') {
        return null;
    }

    return <ThreeBackground />;
}
