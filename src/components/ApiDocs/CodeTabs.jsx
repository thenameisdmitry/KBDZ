import React, { useState } from 'react';

const tabBase = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '9px 16px',
  fontSize: '12px',
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.03em',
  transition: 'color 0.15s',
  borderBottom: '2px solid transparent',
  outline: 'none',
};

/**
 * CodeTabs
 * Props:
 *   curl   — string  (cURL snippet)
 *   python — string  (Python snippet)
 *   label  — string  (optional override header label, default "Request")
 */
export default function CodeTabs({ curl, python, label = 'Request' }) {
  const tabs = [
    curl   && { id: 'curl',   label: 'cURL' },
    python && { id: 'python', label: 'Python' },
  ].filter(Boolean);

  const [active, setActive] = useState(tabs[0]?.id || 'curl');
  const code = active === 'curl' ? curl : python;

  return (
    <div
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #838383',
        marginTop: '14px',
        marginBottom: '24px',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#131829',
          borderBottom: '1px solid #838383',
          padding: '0 8px 0 4px',
        }}
      >
        <div style={{ display: 'flex' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                ...tabBase,
                color: active === tab.id ? '#9129baff' : '#4a5e84',
                fontWeight: active === tab.id ? 600 : 400,
                borderBottom: `2px solid ${active === tab.id ? '#9129baff' : 'transparent'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span
          style={{
            fontSize: '10px',
            color: '#f0f0f0',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>

      {/* Code */}
      <pre
        style={{
          margin: 0,
          padding: '20px 24px',
          background: '#0d1117',
          color: '#f0f0f0',
          fontSize: '12.5px',
          lineHeight: 1.72,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code style={{ fontFamily: 'inherit', background: 'none', padding: 0 }}>
          {code}
        </code>
      </pre>
    </div>
  );
}
