import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const isError = type === 'danger' || type === 'error';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        marginBottom: '1rem',
        backgroundColor: isError ? 'var(--danger-bg)' : 'var(--success-bg)',
        border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`,
        color: isError ? 'var(--danger)' : 'var(--success)',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
