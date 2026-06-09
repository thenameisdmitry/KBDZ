import React from 'react';

const STYLES = {
  GET: {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #86efac',
  },
  POST: {
    background: '#dbeafe',
    color: '#1e40af',
    border: '1px solid #93c5fd',
  },
  PATCH: {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fcd34d',
  },
  DELETE: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
  },
};

/**
 * MethodBadge
 * @param {string} method — GET | POST | PATCH | DELETE
 * @param {boolean} large — larger size (used in section headers)
 */
export default function MethodBadge({ method, large = false }) {
  const s = STYLES[method] || STYLES.GET;

  return (
    <span
      style={{
        ...s,
        display: 'inline-block',
        fontSize: large ? '15px' : '10.5px',
        fontWeight: 900,
        padding: large ? '4px 11px' : '2px 8px',
        borderRadius: '5px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', monospace",
        letterSpacing: '0.07em',
        lineHeight: 1.45,
        flexShrink: 0,
      }}
    >
      {method}
    </span>
  );
}
