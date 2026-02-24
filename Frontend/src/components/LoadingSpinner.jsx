import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
    if (fullScreen) {
        return (
            <div className="spinner-fullscreen">
                <div className="spinner" />
            </div>
        );
    }
    return (
        <div className="spinner-container">
            <div className="spinner" />
        </div>
    );
}
