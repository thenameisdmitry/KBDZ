import React, { useState } from 'react';

export default function Example({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      margin: '24px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(131,131,131,0.15)',
    }}>

      {/* ── Header ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 18px',
          background: 'rgba(131,131,131,0.07)',
          border: 'none',
          borderBottom: open ? '1px solid rgba(131,131,131,0.15)' : 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.5"/>
            <path d="M5.5 5.5C5.5 4.7 6.1 4 7 4s1.5.7 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="7" cy="10.5" r="0.75" fill="#999999"/>
          </svg>
          {/* Label */}
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#999999',
          }}>
            Example
          </span>
          {/* Title */}
          {title && (
            <span style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--ifm-font-color-base)',
              letterSpacing: 0,
            }}>
              {title}
            </span>
          )}
        </div>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="5" width="12" height="8" rx="1.5" stroke="#999999" strokeWidth="1.5"/>
          <path d="M4 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="#999999" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="1" y1="9" x2="13" y2="9" stroke="#999999" strokeWidth="1.5"/>
        </svg>
      </button>

      {/* ── Body ── */}
      {open && (
        <div style={{
          padding: '16px 18px',
          background: 'rgba(131,131,131,0.03)',
          fontSize: '1rem',
          lineHeight: 1.75,
          color: '#c2c2c2ff',
        }}>
          {children}
        </div>
      )}

    </div>
  );
}
