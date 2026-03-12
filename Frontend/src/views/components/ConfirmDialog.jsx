import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
    return (
        <Modal title="Confirm Action" onClose={onCancel} size="sm">
            <p className="confirm-message">{message || 'Are you sure? This action cannot be undone.'}</p>
            <div className="confirm-actions">
                <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
                <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                    {loading ? 'Deleting…' : 'Yes, Delete'}
                </button>
            </div>
        </Modal>
    );
}
