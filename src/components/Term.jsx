import React from 'react';

export default function Term({ name, children }) {
  return (
    <div style={{
      display: 'inline-block',
      width: '100%',
      margin: '12px 0',
      padding: '14px 18px',
      background: 'rgba(131,131,131,0.06)',
      border: '1px solid rgba(131,131,131,0.2)',
      borderLeft: '5px solid #999999',
      borderRadius: '6px',
      fontFamily: 'inherit',
    }}>
      <span style={{
        display: 'block',
        fontSize: '0.78rem',
        fontStyle: 'italic',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#999999',
        marginBottom: '6px',
      }}>
        Term
      </span>
      <span style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--ifm-font-color-base)',
        marginRight: '6px',
      }}>
        {name}
      </span>
      <span style={{
        fontSize: '1rem',
        color: 'var(--site-muted-text)',
        lineHeight: 1.65,
      }}>
        {children}
      </span>
    </div>
  );
}