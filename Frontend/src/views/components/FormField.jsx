import React from 'react';

export default function FormField({ label, name, type = 'text', value, onChange, options, required, placeholder, error, disabled, rows }) {
    const id = `field-${name}`;
    return (
        <div className="form-field">
            {label && <label className="form-label" htmlFor={id}>{label}{required && <span className="required-star">*</span>}</label>}
            {type === 'select' ? (
                <select id={id} name={name} value={value} onChange={onChange} className={`form-input ${error ? 'input-error' : ''}`} disabled={disabled}>
                    <option value="">-- Select --</option>
                    {(options || []).map(opt => (
                        <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea id={id} name={name} value={value} onChange={onChange} className={`form-input ${error ? 'input-error' : ''}`}
                    placeholder={placeholder} disabled={disabled} rows={rows || 3} />
            ) : (
                <input id={id} type={type} name={name} value={value} onChange={onChange}
                    className={`form-input ${error ? 'input-error' : ''}`}
                    placeholder={placeholder} required={required} disabled={disabled} />
            )}
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
