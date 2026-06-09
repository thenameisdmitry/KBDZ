import React from 'react';

const STATUS_STYLES = {
  200: { bg: '#d1fae5', color: '#065f46', label: '200 OK' },
  201: { bg: '#dbeafe', color: '#1e40af', label: '201 Created' },
  204: { bg: '#f3f4f6', color: '#374151', label: '204 No Content' },
  400: { bg: '#fee2e2', color: '#991b1b', label: '400 Bad Request' },
  401: { bg: '#fff7ed', color: '#9a3412', label: '401 Unauthorized' },
  404: { bg: '#fef3c7', color: '#92400e', label: '404 Not Found' },
};

/**
 * ResponseBlock
 * @param {number} status  — HTTP status code
 * @param {object|null} json — JSON body (null for 204)
 * @param {string} label  — optional override label
 */
export default function ResponseBlock({ status = 200, json, label }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES[200];
  const displayLabel = label || s.label;

  return (
    <div style={{ marginTop: '12px', marginBottom: '8px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: '#131829',
          borderRadius: '7px 7px 0 0',
          borderBottom: '0px solid #1e2a4a',
          border: '1px solid #838383',
          borderBottom: json ? 'none' : '1px solid #838383',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: '#f0f0f0',
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.06em',
          }}
        >
          Response
        </span>
        <span
          style={{
            background: s.bg,
            color: s.color,
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {displayLabel}
        </span>
      </div>

      {/* Body */}
      <pre
        style={{
          margin: '0 0 24px',
          padding: json ? '18px 22px' : '14px 22px',
          background: '#0a0d15',
          color: '#f0f0f0',
          fontSize: '12.5px',
          lineHeight: 1.68,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          borderRadius: '0 0 7px 7px',
          overflowX: 'auto',
          border: '1px solid #838383',
          borderTop: 'none',
        }}
      >
        {json
          ? <code style={{ fontFamily: 'inherit', background: 'none', padding: 0 }}>
              {JSON.stringify(json, null, 2)}
            </code>
          : <code style={{ fontFamily: 'inherit', background: 'none', padding: 0, color: '#3a4a72' }}>
              {'// No body returned'}
            </code>
        }
      </pre>
    </div>
  );
}
